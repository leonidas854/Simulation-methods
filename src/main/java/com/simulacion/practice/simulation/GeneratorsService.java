package com.simulacion.practice.simulation;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeneratorsService {

    
    private long extraerCentro(long numero, int digitos) {
        String numStr = String.valueOf(numero);
        while (numStr.length() < digitos * 2) {
            numStr = "0" + numStr;
        }
        int inicio = (numStr.length() - digitos) / 2;
        String centro = numStr.substring(inicio, inicio + digitos);
        return Long.parseLong(centro);
    }

    public List<Map<String, Object>> cuadradosMedios(long semilla, int cantidad, int digitos) {
        List<Map<String, Object>> tabla = new ArrayList<>();
        long xi = semilla;
        for (int i = 0; i < cantidad; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("i", i+1);
            fila.put("Xi", xi);
            long yi = xi * xi;
            fila.put("Yi", yi);
            long xi_1 = extraerCentro(yi, digitos);
            fila.put("Xi_1", xi_1);
            fila.put("ri", xi_1 / Math.pow(10, digitos));
            tabla.add(fila);
            xi = xi_1;
        }
        return tabla;
    }

    public List<Map<String, Object>> productosMedios(long x0, long x1, int cantidad, int digitos) {
        List<Map<String, Object>> tabla = new ArrayList<>();
        long xi = x0;
        long xi_1 = x1;
        for (int i = 0; i < cantidad; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("i", i+1);
            fila.put("Xi", xi);
            fila.put("Xi_1", xi_1);
            long yi = xi * xi_1;
            fila.put("Yi", yi);
            long xi_2 = extraerCentro(yi, digitos);
            fila.put("Xi_2", xi_2);
            fila.put("ri", xi_2 / Math.pow(10, digitos));
            tabla.add(fila);
            xi = xi_1;
            xi_1 = xi_2;
        }
        return tabla;
    }

    public List<Map<String, Object>> multiplicadorConstante(long x0, long a, int cantidad, int digitos) {
        List<Map<String, Object>> tabla = new ArrayList<>();
        long xi = x0;
        for (int i = 0; i < cantidad; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("i", i+1);
            fila.put("a", a);
            fila.put("Xi", xi);
            long yi = a * xi;
            fila.put("Yi", yi);
            long xi_1 = extraerCentro(yi, digitos);
            fila.put("Xi_1", xi_1);
            fila.put("ri", xi_1 / Math.pow(10, digitos));
            tabla.add(fila);
            xi = xi_1;
        }
        return tabla;
    }

    public List<Map<String, Object>> congruencialMixto(long x0, long a, long c, long m, int n) {
        List<Map<String, Object>> tabla = new ArrayList<>();
        long xn = x0;
        for (int i = 0; i < n; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("n", i+1);
            fila.put("Xn", xn);
            long formula = a * xn + c;
            fila.put("aXn_c", formula);
            fila.put("division", formula + " mod " + m);
            long xn_1 = formula % m;
            fila.put("Xn_1", xn_1);
            fila.put("un", (double) xn_1 / m);
            tabla.add(fila);
            xn = xn_1;
        }
        return tabla;
    }

    public List<Map<String, Object>> congruencialMultiplicativo(long x0, long a, long m, int n) {
        List<Map<String, Object>> tabla = new ArrayList<>();
        long xn = x0;
        for (int i = 0; i < n; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("n", i+1);
            fila.put("Xn", xn);
            long formula = a * xn;
            fila.put("aXn", formula);
            fila.put("division", formula + " / " + m);
            long xn_1 = formula % m;
            fila.put("Xn_1", xn_1);
            fila.put("un", (double) xn_1 / m);
            tabla.add(fila);
            xn = xn_1;
        }
        return tabla;
    }

    public List<Map<String, Object>> congruencialAditivo(List<Long> semillas, long m, int cantidad) {
        List<Map<String, Object>> tabla = new ArrayList<>();
        List<Long> x = new ArrayList<>(semillas);
        int n_semillas = semillas.size();
        for (int i = 0; i < cantidad; i++) {
            int index = x.size();
            long x_in = x.get(index - n_semillas); // Xi-n
            long x_i1 = x.get(index - 1);          // Xi-1
            long suma = x_i1 + x_in;

            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("i", i + 1+1);
            fila.put("Xi", x_in); // Semilla principal de esa iteración según tu documento
            fila.put("suma", suma);
            fila.put("division", suma + " / " + m);
            long nuevoX = suma % m;
            fila.put("Xi_1", nuevoX);
            fila.put("ri", (double) nuevoX / m);
            tabla.add(fila);
            x.add(nuevoX);
        }
        return tabla;
    }

    public List<Map<String, Object>> congruencialCuadratico(long x0, long a, long b, long c, long m, int n) {
        List<Map<String, Object>> tabla = new ArrayList<>();
        long xi = x0;
        for (int i = 0; i < n; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("i", i+1);
            fila.put("Xi", xi);
            long formula = a * (xi * xi) + b * xi + c;
            fila.put("formula", formula);
            fila.put("division", formula + " / " + m);
            long xi_1 = formula % m;
            fila.put("Xi_1", xi_1);
            fila.put("ri", (double) xi_1 / m);
            tabla.add(fila);
            xi = xi_1;
        }
        return tabla;
    }

    public List<Map<String, Object>> blumBlumShub(long x0, long m, int n) {
        List<Map<String, Object>> tabla = new ArrayList<>();
        long xi = x0;
        for (int i = 0; i < n; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("i", i+1);
            fila.put("Xi", xi);
            long formula = xi * xi;
            fila.put("formula", formula);
            fila.put("division", formula + " / " + m);
            long xi_1 = formula % m;
            fila.put("Xi_1", xi_1);
            fila.put("ri", (double) xi_1 / m); 
            tabla.add(fila);
            xi = xi_1;
        }
        return tabla;
    }
}