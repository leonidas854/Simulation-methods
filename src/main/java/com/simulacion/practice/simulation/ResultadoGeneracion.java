package com.simulacion.practice.simulation;

import java.util.List;
import java.util.ArrayList;

public class ResultadoGeneracion {
    private List<Double> numerosAleatoriosRi;
    private List<Long> estadosGeneradosXi;
    private int periodoEncontrado;
    private boolean cicloCompletado;
    private List<String> analisisCaracteristicas;

    public ResultadoGeneracion() {
        this.numerosAleatoriosRi = new ArrayList<>();
        this.estadosGeneradosXi = new ArrayList<>();
        this.analisisCaracteristicas = new ArrayList<>();
    }

    public List<Double> getNumerosAleatoriosRi() { return numerosAleatoriosRi; }
    public void setNumerosAleatoriosRi(List<Double> numerosAleatoriosRi) { this.numerosAleatoriosRi = numerosAleatoriosRi; }
    
    public List<Long> getEstadosGeneradosXi() { return estadosGeneradosXi; }
    public void setEstadosGeneradosXi(List<Long> estadosGeneradosXi) { this.estadosGeneradosXi = estadosGeneradosXi; }
    
    public int getPeriodoEncontrado() { return periodoEncontrado; }
    public void setPeriodoEncontrado(int periodoEncontrado) { this.periodoEncontrado = periodoEncontrado; }
    
    public boolean isCicloCompletado() { return cicloCompletado; }
    public void setCicloCompletado(boolean cicloCompletado) { this.cicloCompletado = cicloCompletado; }
    
    public List<String> getAnalisisCaracteristicas() { return analisisCaracteristicas; }
    public void agregarCaracteristica(String caracteristica) { this.analisisCaracteristicas.add(caracteristica); }
}