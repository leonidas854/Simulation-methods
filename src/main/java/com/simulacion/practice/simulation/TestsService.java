package com.simulacion.practice.simulation;

import org.apache.commons.math3.distribution.ChiSquaredDistribution;
import org.apache.commons.math3.distribution.NormalDistribution;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class TestsService {

    // 1. PRUEBA DE PROMEDIOS
    public Map<String, Object> pruebaPromedios(List<Double> numeros, double alfa) {
        int n = Math.min(numeros.size(), 70);
        double suma = 0;
        for (int i = 0; i < n; i++) suma += numeros.get(i);
        
        double media = suma / n;
        double z0 = Math.abs((0.5 - media) * Math.sqrt(n) / Math.sqrt(1.0 / 12.0));
        
       
        NormalDistribution normDist = new NormalDistribution();
        double zCritico = Math.abs(normDist.inverseCumulativeProbability(alfa / 2));
        
        boolean aceptado = z0 < zCritico;

        List<Map<String, Object>> tabla = new ArrayList<>();
        Map<String, Object> fila = new LinkedHashMap<>();
        fila.put("n", n);
        fila.put("Media", media);
        fila.put("Z0 Calculado", z0);
        fila.put("Alfa (α)", alfa);
        fila.put("Z Crítico", zCritico);
        fila.put("¿Aprobado?", aceptado ? "SÍ" : "NO");
        tabla.add(fila);

        Map<String, Object> response = new HashMap<>();
        response.put("tabla", tabla);
        response.put("aceptado", aceptado);
        response.put("mensaje", aceptado ? 
            "<strong>Aceptado:</strong>  No se puede rechazar la hipótesis de que los números pseudoaleatorios provienen de un universo uniforme El Z0 (" + String.format("%.4f", z0) + ") es menor al Z Crítico (" + String.format("%.4f", zCritico) + ")." : 
              "<strong>Rechazado:</strong> se puede rechazar la hipótesis de que los números pseudoaleatorios provienen de un universo uniforme El Z0 (" + String.format("%.4f", z0) + ") es mayor al Z Crítico (" + String.format("%.4f", zCritico) + ")." 
        );
        response.put("chartData", numeros.subList(0, n));
        return response;
    }

    // 2. PRUEBA DE FRECUENCIAS
    public Map<String, Object> pruebaFrecuencias(List<Double> numeros, int intervalos, double alfa) {
        int n = Math.min(numeros.size(), 70);
        List<Double> datos = numeros.subList(0, n);
        
        double esperanza = (double) n / intervalos;
        int[] observadas = new int[intervalos];
        double tamanoIntervalo = 1.0 / intervalos;

        for (Double num : datos) {
            int indice = (int) (num / tamanoIntervalo);
            if (indice >= intervalos) indice = intervalos - 1; 
            observadas[indice]++;
        }

        List<Map<String, Object>> tabla = new ArrayList<>();
        double chiTotal = 0;

        for (int i = 0; i < intervalos; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("Rango", String.format("[%.2f - %.2f)", i * tamanoIntervalo, (i + 1) * tamanoIntervalo));
            fila.put("Oi", observadas[i]);
            fila.put("Ei", esperanza);
            
            double chiFila = Math.pow(observadas[i] - esperanza, 2) / esperanza;
            fila.put("(Oi-Ei)²/Ei", chiFila);
            chiTotal += chiFila;
            tabla.add(fila);
        }

        // Calcular Chi-Cuadrado Crítico
        int df = intervalos - 1;
        ChiSquaredDistribution chiDist = new ChiSquaredDistribution(df);
        double chiCritico = chiDist.inverseCumulativeProbability(1.0 - alfa);
        boolean aceptado = chiTotal < chiCritico;

        Map<String, Object> response = new HashMap<>();
        response.put("tabla", tabla);
        response.put("aceptado", aceptado);
        response.put("mensaje", aceptado ? 


           "<strong>Aceptado:</strong> <u>NO SE PUEDE RECHAZAR LA HIPOTESIS DE QUE LA MUESTRA PROVIENE DE UNA DISTRIBUCIÓN UNIFORME</u> Chi-Cuadrada ("
+ String.format("%.4f", chiTotal) + 
") es menor al valor crítico de tabla (" + 
String.format("%.4f", chiCritico) + ")."

: 
            "<strong>Rechazado:</strong> <u>SE PUEDE RECHAZAR LA HIPOTESIS DE QUE LA MUESTRA PROVIENE DE UNA DISTRIBUCIÓN UNIFORME</u> Chi-Cuadrada ("
+ String.format("%.4f", chiTotal) + 
") es mayor al valor crítico de tabla (" + 
String.format("%.4f", chiCritico) + ")."
        
        );
        return response;
    }

    // 3. PRUEBA DE KOLMOGOROV-SMIRNOV
    public Map<String, Object> pruebaKolmogorovSmirnov(List<Double> numeros, double alfa) {
        int n = Math.min(numeros.size(), 70);
        List<Double> datos = new ArrayList<>(numeros.subList(0, n));
        Collections.sort(datos);

        List<Map<String, Object>> tabla = new ArrayList<>();
        double dMax = 0;
        List<Double> xVals = new ArrayList<>(), yObs = new ArrayList<>(), yEsp = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            double ri = datos.get(i);
            double iN = (double) (i + 1) / n;
            
            double dMenos = Math.abs(ri - iN);
            double d = Math.max(dMax, dMenos);
            if (d > dMax) dMax = d;

            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("i", i + 1);
            fila.put("ri", ri);
            fila.put("i/N", iN);
         
            fila.put("D", dMenos);
            fila.put("D = max", d);
            tabla.add(fila);

            xVals.add(ri); yObs.add(iN); yEsp.add(ri);
        }

   
        double dCritico = alfa == 0.01 ? 1.63 / Math.sqrt(n+1) : 1.36 / Math.sqrt(n+1); // Default alfa=0.05
        boolean aceptado = dMax < dCritico;

        Map<String, Object> response = new HashMap<>();
        response.put("tabla", tabla);
        response.put("aceptado", aceptado);
        response.put("mensaje", aceptado ? 
            "<strong>Aceptado (K-S):</strong> No se puede rechazar la hipótesis de que los números provienen de una distribucion uniforme D Máximo (" + String.format("%.4f", dMax) + ") es menor al D Crítico (" + String.format("%.2f", dCritico) + ")."
             : 
         "<strong>Rechazado (K-S):</strong> Se rechaza la hipótesis de que los números provienen de una distribucion uniforme D Máximo (" + String.format("%.4f", dMax) + ") es mayor al D Crítico (" + String.format("%.2f", dCritico) + ")."
             
        );
        response.put("xVals", xVals); response.put("yObs", yObs); response.put("yEsp", yEsp);
        return response;
    }


    public Map<String, Object> pruebaSeries(List<Double> numeros, double alfa, int subInt) {
        int n = Math.min(numeros.size(), 70);
        int nParejas = n - 1;
        double ei = (double) nParejas / (subInt * subInt);

        int[][] observadas = new int[subInt][subInt];
        int[][] matrizVisual = new int[subInt][subInt]; 
        List<Map<String, Double>> coordenadas = new ArrayList<>();

        for (int i = 0; i < n - 1; i++) {
            double x = numeros.get(i);
            double y = numeros.get(i + 1);
            coordenadas.add(Map.of("x", x, "y", y));

            int celdaX = Math.min((int) (x * subInt), subInt - 1);
            int celdaY = Math.min((int) (y * subInt), subInt - 1);
            
            observadas[celdaX][celdaY]++; 
            int visualRow = (subInt - 1) - celdaY;
            matrizVisual[visualRow][celdaX]++;
        }

        double chiTotal = 0;
        List<Map<String, Object>> tabla = new ArrayList<>();
        
        // El cálculo matemático se mantiene igual
        for (int i = 0; i < subInt; i++) {
            for (int j = 0; j < subInt; j++) {
                int oi = observadas[i][j];
                double chiCelda = Math.pow(oi - ei, 2) / ei;
                chiTotal += chiCelda;

                Map<String, Object> fila = new LinkedHashMap<>();
                fila.put("Celda (X,Y)", "(" + (i+1) + "," + (j+1) + ")");
                fila.put("Oi", oi);
                fila.put("Ei", ei);
                fila.put("(Oi-Ei)²/Ei", chiCelda);
                tabla.add(fila);
            }
        }

        int df = (subInt * subInt) - 1 ;
        ChiSquaredDistribution chiDist = new ChiSquaredDistribution(df);
        double chiCritico = chiDist.inverseCumulativeProbability(1.0 - alfa);
        boolean aceptado = chiTotal < chiCritico;

        // --- Generación de etiquetas para los ejes (0.2, 0.4, etc.) ---
        List<String> xLabels = new ArrayList<>();
        List<String> yLabels = new ArrayList<>();
        double paso = 1.0 / subInt;
        for(int i = 0; i < subInt; i++) {
            xLabels.add(String.format(Locale.US, "%.2f", (i + 1) * paso));
            yLabels.add(String.format(Locale.US, "%.2f", 1.0 - (i * paso))); 
        }

        Map<String, Object> response = new HashMap<>();
        response.put("tabla", tabla);
        response.put("matrizFO", matrizVisual); // <--- Enviamos la matriz formateada visualmente
        response.put("xLabels", xLabels);       // Eje X inferior
        response.put("yLabels", yLabels);       // Eje Y izquierdo
        response.put("aceptado", aceptado);
        response.put("mensaje", aceptado ? 
            "<strong>Aceptado:</strong> no se puede rechazar la hipotesis de que los numeros provienen de una distribucion independiente Chi-Cuadrada Series (" + String.format("%.4f", chiTotal) + ") es menor al Crítico (" + String.format("%.2f", chiCritico) + ")." 
            : 
            "<strong>Rechazado:</strong> Se puede rechazar la hipotesis de que los numeros provienen de una distribucion independiente Chi-Cuadrada Series (" + String.format("%.4f", chiTotal) + ") es mayor al Crítico (" + String.format("%.2f", chiCritico) + ")." 
            
        
        );
        response.put("coordenadas", coordenadas);
        return response;
    }
   
 // 4. PRUEBA DE POKER DINÁMICA (3, 4 o 5 decimales)
    public Map<String, Object> pruebaPoker(List<Double> numeros, double alfa, int decimales) {
        int n = Math.min(numeros.size(), 70);
        
        String[] nombres;
        String[] abrevs; // NUEVO: Para guardar las letras (TD, 1P, etc.)
        double[] prob;
        int[] conteo;

        if (decimales == 3) {
            nombres = new String[]{"Todos Diferentes (TD)", "Exactamente un par (1P)", "Tercia (T)"};
            abrevs = new String[]{"TD", "1P", "T"};
            prob = new double[]{0.72, 0.27, 0.01};
            conteo = new int[3];
        } else if (decimales == 4) {
            nombres = new String[]{"Todos Diferentes (TD)", "Exactamente un par (1P)", "2 pares (2P)", "Tercia (T)", "Poker (P)"};
            abrevs = new String[]{"TD", "1P", "2P", "T", "P"};
            prob = new double[]{0.5040, 0.4320, 0.0270, 0.0360, 0.0010};
            conteo = new int[5];
        } else { // 5 decimales (Por defecto)
            nombres = new String[]{"Todos diferentes (TD)", "Exactamente un par (1P)", "2 pares (2P)", "1 Tercia y 1 par (TP)", "Tercia (T)", "Poker (P)", "Quintilla (Q)"};
            abrevs = new String[]{"TD", "1P", "2P", "TP", "T", "P", "Q"};
            prob = new double[]{0.3024, 0.5040, 0.1080, 0.0090, 0.0720, 0.0045, 0.0001};
            conteo = new int[7];
        }

        // NUEVO: Lista para guardar el detalle de cada número
        List<Map<String, Object>> detalleNumeros = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            double num = numeros.get(i);
            String formato = "%." + decimales + "f";
            String decStr = String.format(Locale.US, formato, num).split("\\.")[1];
            
            Map<Character, Integer> counts = new HashMap<>();
            for (char c : decStr.toCharArray()) counts.put(c, counts.getOrDefault(c, 0) + 1);
            
            int size = counts.values().size();
            int index = -1;
            
            // Asignar el índice correspondiente según la mano
            if (decimales == 3) {
                if (size == 3) index = 0; // TD
                else if (size == 2) index = 1; // 1P
                else if (size == 1) index = 2; // T
            } else if (decimales == 4) {
                if (size == 4) index = 0; // TD
                else if (size == 3) index = 1; // 1P
                else if (size == 2) { index = counts.containsValue(3) ? 3 : 2; } // T o 2P
                else if (size == 1) index = 4; // P
            } else { // 5 decimales
                if (size == 5) index = 0; // TD
                else if (size == 4) index = 1; // 1P
                else if (size == 3) { index = counts.containsValue(3) ? 4 : 2; } // T o 2P
                else if (size == 2) { index = counts.containsValue(4) ? 5 : 3; } // P o TP
                else if (size == 1) index = 6; // Q
            }
            
            conteo[index]++;
            
            // Guardar el número y su clasificación para el Frontend
            Map<String, Object> det = new HashMap<>();
            det.put("numero", num);
            det.put("mano", abrevs[index]);
            detalleNumeros.add(det);
        }

        List<Map<String, Object>> tabla = new ArrayList<>();
        double chiTotal = 0;
        for (int i = 0; i < nombres.length; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            double ei = prob[i] * n;
            double chiFila = ei == 0 ? 0 : Math.pow(conteo[i] - ei, 2) / ei;
            
            fila.put("Categoría", nombres[i]);
            fila.put("Probabilidad", prob[i]);
            fila.put("Oi", conteo[i]);
            fila.put("Ei", ei);
            fila.put("(Oi-Ei)²/Ei", chiFila);
            chiTotal += chiFila;
            tabla.add(fila);
        }

        int gradosLibertad = nombres.length - 1;
        ChiSquaredDistribution chiDist = new ChiSquaredDistribution(gradosLibertad);
        double chiCritico = chiDist.inverseCumulativeProbability(1.0 - alfa);
        boolean aceptado = chiTotal < chiCritico;

        Map<String, Object> response = new HashMap<>();
        response.put("detalle", detalleNumeros); // <--- NUEVO: Enviamos el detalle al Frontend
        response.put("tabla", tabla);
        response.put("aceptado", aceptado);
        response.put("mensaje", aceptado ?
            "<strong>Aceptado:</strong> No se puede rechazar la hipotesis de que los numeros provienen de una distribucion uniforme Chi-Cuadrada Poker (" + String.format("%.4f", chiTotal) + ") es menor al Crítico (" + String.format("%.4f", chiCritico) + ")."
             : 
             "<strong>Rechazado:</strong> Se puede rechazar la hipotesis de que los numeros provienen de una distribucion uniforme Chi-Cuadrada Poker (" + String.format("%.4f", chiTotal) + ") es mayor al Crítico (" + String.format("%.4f", chiCritico) + ")."
             
        );
        return response;
    }

    // 6. PRUEBA DE HUECOS DINÁMICA (Basado en imagen 5)
    public Map<String, Object> pruebaHuecos(List<Double> numeros, double alfaSignificancia, double alfaHueco, double betaHueco, int maxHueco) {
        int n = Math.min(numeros.size(), 70);
        
        StringBuilder seqS = new StringBuilder("{");
        List<Integer> binarios = new ArrayList<>();
        
        for (int i = 0; i < n; i++) {
            double num = numeros.get(i);
            int bit = (num >= alfaHueco && num <= betaHueco) ? 1 : 0;
            binarios.add(bit);
            seqS.append(bit).append(i == n - 1 ? "}" : ", ");
        }

        Map<Integer, Integer> oiMap = new HashMap<>();
        int cerosConsecutivos = 0;
        int h = 0;

        boolean primerUnoEncontrado = false;
        for (int b : binarios) {
            if (b == 1) {
                if (primerUnoEncontrado) {
                    oiMap.put(cerosConsecutivos, oiMap.getOrDefault(cerosConsecutivos, 0) + 1);
                    h++;
                }
                primerUnoEncontrado = true;
                cerosConsecutivos = 0;
            } else {
                if (primerUnoEncontrado) cerosConsecutivos++;
            }
        }

        List<Map<String, Object>> tabla = new ArrayList<>();
        double prob = betaHueco - alfaHueco;
        double chiTotal = 0;
        double sumEi = 0;
        int oiAcumuladoMax = 0;

        for (int i = 0; i <= maxHueco; i++) {
            Map<String, Object> fila = new LinkedHashMap<>();
            if (i < maxHueco) {
                int oi = oiMap.getOrDefault(i, 0);
                double ei = h * prob * Math.pow(1 - prob, i);
                sumEi += ei;
                double chiFila = ei == 0 ? 0 : Math.pow(oi - ei, 2) / ei;
                chiTotal += chiFila;

                fila.put("Tamaño del Hueco (i)", String.valueOf(i));
                fila.put("Oi", oi);
                fila.put("Ei", ei);
                fila.put("(Oi-Ei)²/Ei", chiFila);
                tabla.add(fila);
            } else { // i >= maxHueco
                for (Map.Entry<Integer, Integer> entry : oiMap.entrySet()) {
                    if (entry.getKey() >= maxHueco) oiAcumuladoMax += entry.getValue();
                }
                double eiUltimo = h - sumEi; 
                double chiFila = eiUltimo == 0 ? 0 : Math.pow(oiAcumuladoMax - eiUltimo, 2) / eiUltimo;
                chiTotal += chiFila;

                fila.put("Tamaño del Hueco (i)", "≥ " + maxHueco);
                fila.put("Oi", oiAcumuladoMax);
                fila.put("Ei", eiUltimo);
                fila.put("(Oi-Ei)²/Ei", chiFila);
                tabla.add(fila);
            }
        }

        // Grados de libertad = (cantidad de intervalos) - 1 = maxHueco
        ChiSquaredDistribution chiDist = new ChiSquaredDistribution(maxHueco);
        double chiCritico = chiDist.inverseCumulativeProbability(1.0 - alfaSignificancia);
        boolean aceptado = chiTotal < chiCritico;

        Map<String, Object> response = new HashMap<>();
        response.put("secuencia", seqS.toString());
        response.put("tabla", tabla);
        response.put("aceptado", aceptado);
        response.put("mensaje", aceptado ? 
            "<strong>Aceptado:</strong> No podemos rechazar la hipotesis de independencia entre los numeros Chi-Cuadrada Huecos (" + String.format("%.4f", chiTotal) + ") es menor al Crítico (" + String.format("%.2f", chiCritico) + ")." 
            : 
            "<strong>Rechazado:</strong> Podemos rechazar la hipotesis de independencia entre los numeros Chi-Cuadrada Huecos (" + String.format("%.4f", chiTotal) + ") es mayor al Crítico (" + String.format("%.2f", chiCritico) + ")." 
        );
        return response;
    }
}