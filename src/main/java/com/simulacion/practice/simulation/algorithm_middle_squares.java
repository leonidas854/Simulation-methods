package com.simulacion.practice.simulation;

public class algorithm_middle_squares {
    private double send;
    private int N;
    
    public algorithm_middle_squares(double send){
        if(send >999.0){
            throw new IllegalArgumentException("the digits must be greater than");
        }
        this.send  = send;
    }


    public double raise(int N){
        double Y = this.send * this.send ;
        return Y;
    }

    
    
}
