package com.simulacion.practice.controller;

import com.simulacion.practice.simulation.GeneratorsService;
import com.simulacion.practice.simulation.TestsService;

import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/simulacion")
public class SimulationController {

    private final GeneratorsService generatorsService;

    private final TestsService testsService;

    public record PruebaPayload(
        List<Double> numeros, 
        Double alfa, 
        Integer intervalos,
        Integer decimales,    // NUEVO: Para Poker
        Double alfaHueco,     // NUEVO: Para Huecos
        Double betaHueco,     // NUEVO: Para Huecos
        Integer maxHueco      // NUEVO: Para Huecos
    ) {}

    
    public SimulationController(GeneratorsService generatorsService, TestsService testsService) {
        this.generatorsService = generatorsService;
        this.testsService = testsService;
    }

    
   @PostMapping("/pruebas/promedios")
    public Map<String, Object> testPromedios(@RequestBody PruebaPayload payload) {
        // Usamos el record, cero warnings
        return testsService.pruebaPromedios(payload.numeros(), payload.alfa());
    }

    @PostMapping("/pruebas/frecuencias")
    public Map<String, Object> testFrecuencias(@RequestBody PruebaPayload payload) {
        return testsService.pruebaFrecuencias(payload.numeros(), payload.intervalos(), payload.alfa());
    }

    @PostMapping("/pruebas/kolmogorov")
    public Map<String, Object> testKolmogorov(@RequestBody PruebaPayload payload) {
        return testsService.pruebaKolmogorovSmirnov(payload.numeros(), payload.alfa());
    }

   @PostMapping("/pruebas/poker")
    public Map<String, Object> testPoker(@RequestBody PruebaPayload payload) {
        // Por defecto usará 5 decimales si no se envía
        int dec = payload.decimales() != null ? payload.decimales() : 5;
        return testsService.pruebaPoker(payload.numeros(), payload.alfa(), dec);
    }

    @PostMapping("/pruebas/huecos")
    public Map<String, Object> testHuecos(@RequestBody PruebaPayload payload) {
        double aHueco = payload.alfaHueco() != null ? payload.alfaHueco() : 0.8;
        double bHueco = payload.betaHueco() != null ? payload.betaHueco() : 1.0;
        int maxH = payload.maxHueco() != null ? payload.maxHueco() : 5;
        return testsService.pruebaHuecos(payload.numeros(), payload.alfa(), aHueco, bHueco, maxH);
    }

    @PostMapping("/pruebas/series")
    public Map<String, Object> testSeries(@RequestBody PruebaPayload payload) {
        return testsService.pruebaSeries(payload.numeros(), payload.alfa(),payload.intervalos());
    }


    @GetMapping("/cuadrados-medios")
    public List<Map<String, Object>> cuadradosMedios(@RequestParam long semilla, @RequestParam int cantidad, @RequestParam int digitos) {
        return generatorsService.cuadradosMedios(semilla, limitar(cantidad), digitos);
    }

    @GetMapping("/productos-medios")
    public List<Map<String, Object>> productosMedios(@RequestParam long x0, @RequestParam long x1, @RequestParam int cantidad, @RequestParam int digitos) {
        return generatorsService.productosMedios(x0, x1, limitar(cantidad), digitos);
    }

    @GetMapping("/multiplicador-constante")
    public List<Map<String, Object>> multiplicadorConstante(@RequestParam long x0, @RequestParam long a, @RequestParam int cantidad, @RequestParam int digitos) {
        return generatorsService.multiplicadorConstante(x0, a, limitar(cantidad), digitos);
    }

    @GetMapping("/congruencial-mixto")
    public List<Map<String, Object>> congruencialMixto(@RequestParam long x0, @RequestParam long a, @RequestParam long c, @RequestParam long m, @RequestParam int n) {
        return generatorsService.congruencialMixto(x0, a, c, m, limitar(n));
    }

    @GetMapping("/congruencial-multiplicativo")
    public List<Map<String, Object>> congruencialMultiplicativo(@RequestParam long x0, @RequestParam long a, @RequestParam long m, @RequestParam int n) {
        return generatorsService.congruencialMultiplicativo(x0, a, m, limitar(n));
    }

    @GetMapping("/congruencial-aditivo")
    public List<Map<String, Object>> congruencialAditivo(@RequestParam String semillas, @RequestParam long m, @RequestParam int cantidad) {
        List<Long> listaSemillas = Arrays.stream(semillas.split(",")).map(String::trim).map(Long::parseLong).collect(Collectors.toList());
        return generatorsService.congruencialAditivo(listaSemillas, m, limitar(cantidad));
    }

    @GetMapping("/congruencial-cuadratico")
    public List<Map<String, Object>> congruencialCuadratico(@RequestParam long x0, @RequestParam long a, @RequestParam long b, @RequestParam long c, @RequestParam long m, @RequestParam int n) {
        return generatorsService.congruencialCuadratico(x0, a, b, c, m, limitar(n));
    }

    @GetMapping("/blum-blum-shub")
    public List<Map<String, Object>> blumBlumShub(@RequestParam long x0, @RequestParam long m, @RequestParam int n) {
        return generatorsService.blumBlumShub(x0, m, limitar(n));
    }
    private int limitar(int n) {
    return Math.min(n, 1000); 
}


}