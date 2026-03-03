package com.simulacion.practice.simulation;

public class algorithm_multipli_const {
    private double send;
    private double constant;
    public algorithm_multipli_const(double send, double constant){
        if(send < 999.0 || constant < 999.0){
            throw new IllegalArgumentException("the digits must be greater than");
        }
        this.send  = send;
        this.constant  = constant;
    }
    public void run(int N){
        for(int i=0; i<N; i++){
           double product = send * constant;
          String productStr = String.format("%08d", (int)product);
          String middleDigits = productStr.substring(2, 6);
          send = Double.parseDouble(middleDigits);
          System.out.println("Iteration " + (i+1) + ": " + send/10000.0);
        }
    }
    public static void main(String[] args) {
        algorithm_multipli_const generator = new algorithm_multipli_const(9803.0, 6965.0);
        generator.run(5);
    }
    
}
