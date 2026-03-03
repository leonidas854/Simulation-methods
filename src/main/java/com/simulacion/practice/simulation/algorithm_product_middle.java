package com.simulacion.practice.simulation;

public class algorithm_product_middle{
    private double send;
    private double send_2;
    public algorithm_product_middle(double send, double send_2){
        if(send < 999.0 || send_2 < 999.0){
            throw new IllegalArgumentException("the digits must be greater than");
        }


    this.send  = send;
    this.send_2  = send_2;

    }
    public void run(int N){
        for(int i=0; i<N; i++){
           double product = send * send_2;
          String productStr = String.format("%08d", (int)product);
          String middleDigits = productStr.substring(2, 6);
          send = send_2;
          send_2 = Double.parseDouble(middleDigits);
          System.out.println("Iteration " + (i+1) + ": " + send_2/10000.0);
        }
    }
    
}