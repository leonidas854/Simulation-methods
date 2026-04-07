from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import sympy as sp
import random

app = FastAPI(title="API de Simulación - Variables Aleatorias")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


class SegmentoAR(BaseModel):
    f_x: str
    a: float
    b: float

class AceptacionPayload(BaseModel):
    segmentos: List[SegmentoAR]     
    M: Optional[float] = None      
    modo: str                       
    cantidad: Optional[int] = None
    numeros_r1: Optional[List[float]] = None
    numeros_r2: Optional[List[float]] = None 

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
                val_crudo = fg["funcion"](r_val)
                x_simulado = float(complex(val_crudo).real)
                tramo_usado = fg["tramo"]
                break
                
        tabla.append({
            "i": i + 1,
            "R": round(r_val, 5),
            "tramo": tramo_usado,
            # FIX 2: Usar "is not None" para que los 0.0 no se conviertan en "None" en tu tabla
            "x_simulado": round(x_simulado, 5) if x_simulado is not None else None
        })
        if x_simulado is not None:
            generados.append(x_simulado)

    return {
        "desarrollo_analitico": analisis_matematico,
        "tabla": tabla
    }

@app.post("/api/simulacion/aceptacion-rechazo")
def aceptacion_rechazo(payload: AceptacionPayload):
    x = sp.Symbol('x', real=True)
    R1 = sp.Symbol('R1', real=True)
    
    tramos_procesados = []
    limite_A = float('inf')   
    limite_B = float('-inf')  
    M_calculado = 0.0         
    
    # ==========================================
    # 1. ANÁLISIS DE FUNCIONES Y MÁXIMO GLOBAL (M)
    # ==========================================
    for seg in payload.segmentos:
        # Sympify ESTÁNDAR (Debes mandar el '*' explícitamente)
        expr_f = sp.sympify(seg.f_x, locals={'x': x}, rational=True)
        f_fast = sp.lambdify(x, expr_f, "math")
        
        # Encontrar límites globales
        if seg.a < limite_A: limite_A = seg.a
        if seg.b > limite_B: limite_B = seg.b
            
        # Calcular el máximo local de ESTA función (para descartar las más bajas luego)
        paso = (seg.b - seg.a) / 1000.0
        max_tramo = 0.0
        for i in range(1001):
            x_val = seg.a + (i * paso)
            y_val = float(f_fast(x_val))
            if y_val > max_tramo:
                max_tramo = y_val
                
        if max_tramo > M_calculado:
            M_calculado = max_tramo
            
        tramos_procesados.append({
            "a": seg.a,
            "b": seg.b,
            "expr_sym": expr_f,
            "f_fast": f_fast,
            "max_tramo": round(max_tramo, 4)
        })

    # Elegir M: el que enviaste, o el máximo global calculado
    M_final = payload.M if payload.M is not None else M_calculado

    # ==========================================
    # 2. LOS 5 PASOS ALGEBRAICOS (Como en tu foto)
    # ==========================================
    # Fórmula base: X* = a + (b-a)R1
    X_est_sym = limite_A + (limite_B - limite_A) * R1
    str_x_estrella = str(sp.simplify(X_est_sym))
    
    pasos_desarrollo = []
    for tramo in tramos_procesados:
        f_sym = tramo["expr_sym"]
        
        # Sustituimos la X de la función por la fórmula de R1
        f_x_est_sym = sp.simplify(f_sym.subs(x, X_est_sym))
        
        # Dividimos entre M
        f_x_m_sym = sp.simplify(f_x_est_sym / M_final)
        
        pasos_desarrollo.append({
            "tramo": f"[{tramo['a']}, {tramo['b']}]",
            "maximo_detectado_aqui": tramo["max_tramo"],
            "Paso_1": f"M = {round(M_final, 4)}",
            "Paso_2": f"X* = {limite_A} + ({limite_B} - {limite_A})R1  =>  X* = {str_x_estrella}",
            "Paso_3": f"f(X*) = {f_x_est_sym}",
            "Paso_4": f"f(X*)/M = {f_x_m_sym}",
            "Paso_5": f"Condición: R2 <= {f_x_m_sym}"
        })

    def evaluar_fx(x_est):
        for tramo in tramos_procesados:
            if tramo["a"] <= x_est <= tramo["b"]:
                return float(tramo["f_fast"](x_est))
        return 0.0 

    # ==========================================
    # 3. GENERACIÓN NUMÉRICA (CON ITERACIÓN 0)
    # ==========================================
    # Tu solicitud explícita: Iteración 0 con variables
    tabla = [{
        "N": 0,
        "R1": "R1",
        "R2": "R2",
        "X_estrella": str_x_estrella,
        "f_X_estrella": "f(X*)",
        "f_X_sobre_M": "f(X*)/M",
        "Condicion": "R2 <= f(X*)/M",
        "Estado": "-",
        "X_i": "-"
    }]
    
    generados = []
    intentos = 0
    idx_manual = 0
    
    lista_r1 = payload.numeros_r1 or []
    lista_r2 = payload.numeros_r2 or []
    cantidad_objetivo = payload.cantidad or 5 

    while len(generados) < cantidad_objetivo and intentos < 2000:
        intentos += 1
        
        if idx_manual < len(lista_r1) and idx_manual < len(lista_r2):
            r1 = lista_r1[idx_manual]
            r2 = lista_r2[idx_manual]
            idx_manual += 1
        else:
            if payload.modo.lower() == "manual":
                break 
            
            r1 = round(random.random(), 5)
            r2 = round(random.random(), 5)

        x_estrella = limite_A + (limite_B - limite_A) * r1
        f_x_est = evaluar_fx(x_estrella)
        f_x_m = f_x_est / M_final
        aceptado = r2 <= f_x_m
        
        tabla.append({
            "N": intentos, 
            "R1": r1, 
            "R2": r2,
            "X_estrella": round(x_estrella, 4),
            "f_X_estrella": round(f_x_est, 4),
            "f_X_sobre_M": round(f_x_m, 4),
            "Condicion": f"{r2} <= {round(f_x_m, 4)}",
            "Estado": "Acepta" if aceptado else "Rechaza",
            "X_i": round(x_estrella, 4) if aceptado else "-"
        })
        
        if aceptado: 
            generados.append(round(x_estrella, 4))

    return {
        "metodo": "Aceptación y Rechazo",
        "A_global": limite_A,
        "B_global": limite_B,
        "M_utilizado": round(M_final, 5),
        "pasos_algebraicos": pasos_desarrollo,
        "total_intentos": intentos,
        "aceptados": len(generados),
        "tabla": tabla,
        "generados_finales": generados
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