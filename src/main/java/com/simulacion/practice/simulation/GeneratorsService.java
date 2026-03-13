package com.simulacion.practice.simulation;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class GeneratorsService {

    private double calcularCentroYRi(long numero, int digitos, long[] nuevoX) {
        String numStr = String.valueOf(numero);
        while (numStr.length() < digitos * 2) {
            numStr = "0" + numStr;
        }
        int inicio = (numStr.length() - digitos) / 2;
        String centro = numStr.substring(inicio, inicio + digitos);
        
        nuevoX[0] = Long.parseLong(centro);
        return nuevoX[0] / Math.pow(10, digitos); 
    }

    public List<Double> cuadradosMedios(long semilla, int cantidad, int digitos) {
        List<Double> resultados = new ArrayList<>();
        long[] x = {semilla};
        
        for (int i = 0; i < cantidad; i++) {
            long y = x[0] * x[0];
            double ri = calcularCentroYRi(y, digitos, x);
            resultados.add(ri);
        }
        return resultados;
    }

    public List<Double> productosMedios(long x0, long x1, int cantidad, int digitos) {
        List<Double> resultados = new ArrayList<>();
        long[] xActual = {x1};
        long xAnterior = x0;
        
        for (int i = 0; i < cantidad; i++) {
            long y = xAnterior * xActual[0];
            xAnterior = xActual[0]; 
            double ri = calcularCentroYRi(y, digitos, xActual);
            resultados.add(ri);
        }
        return resultados;
    }

    public List<Double> multiplicadorConstante(long x0, long a, int cantidad, int digitos) {
        List<Double> resultados = new ArrayList<>();
        long[] x = {x0};
        
        for (int i = 0; i < cantidad; i++) {
            long y = a * x[0];
            double ri = calcularCentroYRi(y, digitos, x);
            resultados.add(ri);
        }
        return resultados;
    }

    public List<Double> congruencialMixto(long x0, long a, long c, long m, int n) {
        List<Double> resultados = new ArrayList<>();
        long x = x0;
        
        for (int i = 0; i < n; i++) {
            x = (a * x + c) % m;
            resultados.add((double) x / m); 
        }
        return resultados;
    }

    public List<Double> congruencialMultiplicativo(long x0, long a, long m, int n) {

        return congruencialMixto(x0, a, 0, m, n);
    }

    public List<Double> congruencialAditivo(List<Long> semillas, long m, int cantidad) {
        List<Double> resultados = new ArrayList<>();
        List<Long> x = new ArrayList<>(semillas);
        int n = semillas.size();
        
        for (int i = 0; i < cantidad; i++) {
            int indexActual = x.size();
            long nuevoX = (x.get(indexActual - 1) + x.get(indexActual - n)) % m;
            x.add(nuevoX);
            resultados.add((double) nuevoX / (m - 1));
        }
        return resultados;
    }

    public List<Double> congruencialCuadratico(long x0, long a, long b, long c, long m, int n) {
        List<Double> resultados = new ArrayList<>();
        long x = x0;
        
        for (int i = 0; i < n; i++) {
            x = (a * (x * x) + b * x + c) % m;
            resultados.add((double) x / m);
        }
        return resultados;
    }

    public List<Double> blumBlumShub(long x0, long m, int n) {
        List<Double> resultados = new ArrayList<>();
        long x = x0;
        
        for (int i = 0; i < n; i++) {
            x = (x * x) % m;
            resultados.add((double) x / m); 
        }
        return resultados;
    }
}