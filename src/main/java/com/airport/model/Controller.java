package com.airport.model;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

public class Controller {
    private final Model model;
    private final View view;

    public Controller(Model model, View view) {
        this.model = model;
        this.view = view;
    }

    public Model getModel() {
        return model;
    }

    public void process(String directory) throws InterruptedException {
        Queue<Plane> planeQueue = new ConcurrentLinkedQueue<>();

        Thread readerThread = new Thread(() -> {
            try {
                model.readPlanesFromDirectory(directory, planeQueue);
            } catch (IOException e) {
                view.printError("Failed to read planes: " + e.getMessage());
            }
        });

        readerThread.start();

        List<Thread> planeThreads = new ArrayList<>();
        while (true) {
            Plane plane = planeQueue.poll();
            if (plane == null && !readerThread.isAlive()) {
                break;
            }
            if (plane != null) {
                Thread planeThread = new Thread(() -> model.addPlanePassengersToGlobalList(plane));
                planeThreads.add(planeThread);
                planeThread.start();
            }
        }

        readerThread.join();
        for (Thread planeThread : planeThreads) {
            planeThread.join();
        }

        List<Bus> buses = model.distributePassengers();
        synchronized (model.getBuses()) {
            model.addBuses(buses);
            view.printResults(buses);
        }
    }
}
