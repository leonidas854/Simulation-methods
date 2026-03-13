package com.simulacion.practice.controller;

import com.simulacion.practice.simulation.GeneratorsService;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/simulacion")
public class SimulationController {

    private final GeneratorsService generatorsService;

    public SimulationController(GeneratorsService generatorsService) {
        this.generatorsService = generatorsService;
    }

    @GetMapping("/cuadrados-medios")
    public List<Double> cuadradosMedios(@RequestParam long semilla, @RequestParam int cantidad, @RequestParam int digitos) {
        return generatorsService.cuadradosMedios(semilla, cantidad, digitos);
    }

    @GetMapping("/productos-medios")
    public List<Double> productosMedios(@RequestParam long x0, @RequestParam long x1, @RequestParam int cantidad, @RequestParam int digitos) {
        return generatorsService.productosMedios(x0, x1, cantidad, digitos);
    }

    @GetMapping("/multiplicador-constante")
    public List<Double> multiplicadorConstante(@RequestParam long x0, @RequestParam long a, @RequestParam int cantidad, @RequestParam int digitos) {
        return generatorsService.multiplicadorConstante(x0, a, cantidad, digitos);
    }

    @GetMapping("/congruencial-mixto")
    public List<Double> congruencialMixto(@RequestParam long x0, @RequestParam long a, @RequestParam long c, @RequestParam long m, @RequestParam int n) {
        return generatorsService.congruencialMixto(x0, a, c, m, n);
    }

    @GetMapping("/congruencial-multiplicativo")
    public List<Double> congruencialMultiplicativo(@RequestParam long x0, @RequestParam long a, @RequestParam long m, @RequestParam int n) {
        return generatorsService.congruencialMultiplicativo(x0, a, m, n);
    }

    @GetMapping("/congruencial-aditivo")
    public List<Double> congruencialAditivo(@RequestParam String semillas, @RequestParam long m, @RequestParam int cantidad) {
        // Convierte el string "65,89,98" a una lista de Longs
        List<Long> listaSemillas = Arrays.stream(semillas.split(","))
                                         .map(String::trim)
                                         .map(Long::parseLong)
                                         .collect(Collectors.toList());
        return generatorsService.congruencialAditivo(listaSemillas, m, cantidad);
    }

    @GetMapping("/congruencial-cuadratico")
    public List<Double> congruencialCuadratico(@RequestParam long x0, @RequestParam long a, @RequestParam long b, @RequestParam long c, @RequestParam long m, @RequestParam int n) {
        return generatorsService.congruencialCuadratico(x0, a, b, c, m, n);
    }

    @GetMapping("/blum-blum-shub")
    public List<Double> blumBlumShub(@RequestParam long x0, @RequestParam long m, @RequestParam int n) {
        return generatorsService.blumBlumShub(x0, m, n);
    }
}