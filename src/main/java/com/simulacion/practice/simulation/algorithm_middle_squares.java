package com.simulacion.practice.simulation;

public class algorithm_middle_squares {
    private double send;
    private int N;
    
    public algorithm_middle_squares(double send){
        if(send <999.0){
            throw new IllegalArgumentException("the digits must be greater than");
        }
        this.send  = send;
    }


    public void run(int N){
        this.N = N;
        for(int i=0; i<N; i++){
            double square = Math.pow(send, 2);
            String squareStr = String.format("%08d", (int)square);
            String middleDigits = squareStr.substring(2, 6);
            send = Double.parseDouble(middleDigits);
            System.out.println("Iteration " + (i+1) + ": " + send/10000.0);
        }
    }
    
    
    
}
