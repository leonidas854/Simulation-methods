package com.simulacion.practice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    
    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }


    @GetMapping("/simulador")
    public String simulador() {
        return "forward:/index.html";
    }
}