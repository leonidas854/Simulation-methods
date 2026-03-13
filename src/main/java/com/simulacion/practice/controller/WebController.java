package com.simulacion.practice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    // Redirige la raíz "/" a tu index.html
    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    // Opcional: Si quieres que también funcione entrando a "/simulador"
    @GetMapping("/simulador")
    public String simulador() {
        return "forward:/index.html";
    }
}