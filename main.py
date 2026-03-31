from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Optional
import sympy as sp
import random

app = FastAPI(title="API de Simulación - Variables Aleatorias")


class PuntosPayload(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float

class Segmento(BaseModel):
    f_x: str
    a: float
    b: float

class InversaCompletaPayload(BaseModel):
    cantidad: int
    segmentos: List[Segmento]

class AceptacionPayload(BaseModel):
    cantidad: int
    funcion_f: str
    a: float
    b: float
    M: float
    parametros: Optional[Dict[str, float]] = None

class ComposicionPayload(BaseModel):
    cantidad: int
    areas: List[float]
    funciones_inversas: List[str]
    parametros: Optional[Dict[str, float]] = None

# ==========================================
# ENDPOINTS (Controladores)
# ==========================================

@app.post("/api/simulacion/funcion-desde-puntos")
def funcion_desde_puntos(payload: PuntosPayload):
    """ Función Extra 0: Consigue la ecuación lineal a partir de dos puntos dados """
    x1, y1 = payload.x1, payload.y1
    x2, y2 = payload.x2, payload.y2
    
    m = (y2 - y1) / (x2 - x1)
    b = y1 - (m * x1)
    
    # Formatear la ecuación para que Python la entienda bien luego
    ecuacion = f"{m}*x + {b}" if b >= 0 else f"{m}*x - {abs(b)}"
    
    return {
        "pendiente_m": round(m, 4),
        "interseccion_b": round(b, 4),
        "funcion": ecuacion
    }
@app.post("/api/simulacion/inversa-analitica")
def inversa_analitica(payload: InversaCompletaPayload):
    # Variables simbólicas
    x = sp.Symbol('x', real=True)
    t = sp.Symbol('t', real=True)
    R = sp.Symbol('R', real=True)
    
    F_acumulada = sp.S(0) 
    analisis_matematico = []
    funciones_generadoras = []
    
    # ==========================================
    # FASE 1: ÁLGEBRA Y CÁLCULO SIMBÓLICO
    # ==========================================
    for seg in payload.segmentos:
        # CORRECCIÓN 1: Pasar 'locals' para que sympify use nuestra 'x' exacta
        f_x_expr = sp.sympify(seg.f_x, locals={'x': x}, rational=True)
        
        # 1. Integrar f(t) desde 'a' hasta 'x'
        f_t = f_x_expr.subs(x, t)
        F_parcial = sp.integrate(f_t, (t, seg.a, x))
        
        # F(x) total
        F_x_total = sp.simplify(F_acumulada + F_parcial)
        
        # 2. Calcular límites de R 
        # CORRECCIÓN 2: Usar .evalf() para forzar el cálculo numérico exacto antes de float()
        R_min = float(F_acumulada.evalf())
        R_max = float(F_x_total.subs(x, seg.b).evalf())
        
        # 3. Despejar 'x' de la ecuación: F_x_total - R = 0
        ecuacion = sp.Eq(F_x_total, R)
        soluciones_x = sp.solve(ecuacion, x)
        
        # 4. Filtrar la raíz correcta (la que cae dentro del intervalo a, b)
        R_prueba = (R_min + R_max) / 2.0  
        solucion_correcta = soluciones_x[0] if soluciones_x else x 
        
        for sol in soluciones_x:
            try:
                # CORRECCIÓN 3: Evaluar y extraer SOLO la parte real de la solución.
                # A veces las raíces cuadradas generan residuos imaginarios diminutos (ej. + 0.e-20 I)
                val_eval = sol.subs(R, R_prueba).evalf()
                val_prueba = float(sp.re(val_eval)) # Forzamos a que solo lea el número real
                
                # Validar que caiga en [a, b] con un pequeño margen de tolerancia
                if seg.a - 0.001 <= val_prueba <= seg.b + 0.001:
                    solucion_correcta = sol 
                    break
            except Exception:
                continue
        
        # Guardar resultados analíticos para el Frontend
        analisis_matematico.append({
            "intervalo_x": f"[{seg.a}, {seg.b}]",
            "intervalo_R": f"[{round(R_min, 4)}, {round(R_max, 4)}]",
            "f_densidad": str(f_x_expr),
            "F_acumulada": str(F_x_total),
            "X_despejada": str(solucion_correcta)
        })
        
        # Guardar la función compilada en C para generar números rápido
        funciones_generadoras.append({
            "R_max": R_max,
            "funcion": sp.lambdify(R, solucion_correcta, "math"),
            "tramo": f"[{seg.a}, {seg.b}]"
        })
        
        # Actualizar área para el siguiente tramo
        F_acumulada = F_x_total.subs(x, seg.b)

    # ==========================================
    # FASE 2: GENERACIÓN DE NÚMEROS
    # ==========================================
    tabla = []
    generados = []
    
    for i in range(min(payload.cantidad, 1000)):
        r_val = random.random()
        x_simulado = None
        tramo_usado = ""
        
        # Buscar en qué tramo cae R
        for fg in funciones_generadoras:
            if r_val <= fg["R_max"]:
                x_simulado = fg["funcion"](r_val)
                tramo_usado = fg["tramo"]
                break
                
        tabla.append({
            "i": i + 1,
            "R": round(r_val, 5),
            "tramo": tramo_usado,
            "x_simulado": round(x_simulado, 5) if x_simulado else None
        })
        if x_simulado is not None:
            generados.append(x_simulado)

    return {
        "desarrollo_analitico": analisis_matematico,
        "tabla": tabla
    }

@app.post("/api/simulacion/aceptacion-rechazo")
def aceptacion_rechazo(payload: AceptacionPayload):
    """ Función 2: Método de Aceptación y Rechazo General """
    x_sym = sp.Symbol('x')
    expr = sp.sympify(payload.funcion_f)
    
    if payload.parametros:
        expr = expr.subs(payload.parametros)
        
    f_fast = sp.lambdify(x_sym, expr, "math")
    
    tabla = []
    generados = []
    intentos = 0
    cantidad_limite = min(payload.cantidad, 1000)
    
    while len(generados) < cantidad_limite:
        intentos += 1
        r1 = random.random()
        r2 = random.random()
        
        # x* = a + (b-a)R1
        x_estrella = payload.a + (payload.b - payload.a) * r1
        
        # f(x*)
        f_x = f_fast(x_estrella)
        
        # Condición: R2 <= f(x*) / M
        aceptado = r2 <= (f_x / payload.M)
        
        tabla.append({
            "Intento": intentos,
            "R1": r1,
            "R2": r2,
            "x_estrella": x_estrella,
            "f_x": f_x,
            "Estado": "ACEPTADO" if aceptado else "RECHAZADO"
        })
        
        if aceptado:
            generados.append(x_estrella)
            
    return {
        "metodo": "Aceptación-Rechazo",
        "total_intentos": intentos,
        "eficiencia_porcentaje": round((cantidad_limite / intentos) * 100, 2),
        "tabla": tabla,
        "generados": generados
    }


@app.post("/api/simulacion/composicion")
def composicion(payload: ComposicionPayload):
    """ Función 3: Método de Composición General """
    # Crear las áreas acumuladas
    areas_acumuladas = []
    suma = 0.0
    for a in payload.areas:
        suma += a
        areas_acumuladas.append(suma)
        
    # Preparar las funciones rápidas para cada área
    R_sym = sp.Symbol('R')
    funciones_fast = []
    for func_str in payload.funciones_inversas:
        expr = sp.sympify(func_str)
        if payload.parametros:
            expr = expr.subs(payload.parametros)
        funciones_fast.append(sp.lambdify(R_sym, expr, "math"))

    tabla = []
    generados = []
    
    for i in range(min(payload.cantidad, 1000)):
        r1 = random.random()
        r2 = random.random()
        
        # Encontrar qué área corresponde según R1
        indice_area = 0
        for j, area_acum in enumerate(areas_acumuladas):
            if r1 <= area_acum:
                indice_area = j
                break
                
        # Evaluar la función correspondiente usando R2
        f_seleccionada = funciones_fast[indice_area]
        x = f_seleccionada(r2)
        
        tabla.append({
            "i": i + 1,
            "R1": r1,
            "Area_Seleccionada": indice_area + 1,
            "R2": r2,
            "x_simulado": x
        })
        generados.append(x)
        
    return {
        "metodo": "Composición",
        "tabla": tabla,
        "generados": generados
    }

# Para correr en tu máquina directamente
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)