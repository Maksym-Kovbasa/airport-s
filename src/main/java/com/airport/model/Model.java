package com.airport.model;

import java.io.*;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

public class Model {
    private final List<Family> globalPassengerList = Collections.synchronizedList(new ArrayList<>());
    private final Queue<Bus> buses = new ConcurrentLinkedQueue<>();

    public void readPlanesFromDirectory(String directoryName, Queue<Plane> planeQueue) throws IOException {
        File directory = new File(directoryName);
        File[] files = directory.listFiles((dir, name) -> name.endsWith(".txt"));
        
        if (files != null) {
            List<Thread> threads = new ArrayList<>();
            int planeId = 1;

            for (File file : files) {
                int currentPlaneId = planeId++;
                Thread thread = new Thread(() -> {// Потік для читання та обробки кожного файлу
                    try (Scanner scanner = new Scanner(new FileReader(file))) {
                        List<Family> families = new ArrayList<>();
                        while (scanner.hasNextLine()) {
                            String line = scanner.nextLine();
                            String[] parts = line.split(" ");
                            if (parts.length != 3) continue;

                            String name = parts[0];
                            String travelTo = parts[1];
                            int count = Integer.parseInt(parts[2]);
                            families.add(new Family(name, travelTo, count, currentPlaneId));
                        }

                        int totalPassengers = families.stream().mapToInt(f -> f.count).sum();
                        if (totalPassengers <= 100 && totalPassengers >= 30) {
                            Plane plane = new Plane(currentPlaneId, families);
                            planeQueue.add(plane);
                        } else {
                            System.out.println("Error: Plane in " + file.getName() + 
                                               " has invalid number of passengers: " + totalPassengers);
                        }
                    } catch (IOException e) {
                        System.err.println("Error reading file " + file.getName() + ": " + e.getMessage());
                    }
                });
                threads.add(thread);
                thread.start();
            }

            for (Thread thread : threads) {
                try {
                    thread.join();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.err.println("Thread was interrupted: " + e.getMessage());
                }
            }
        } else {
            System.out.println("No files found in directory " + directoryName);
        }
    }

    public void addPlanePassengersToGlobalList(Plane plane) {
        for (Family family : plane.families) {
            globalPassengerList.add(new Family(family.name, family.travelTo, family.count, plane.id));
        }
    }

    public List<Bus> distributePassengers() {
        List<Bus> buses = new ArrayList<>();
        String[] cities = { "Kalush", "Kosiv", "Galych", "Kolomiya" };
        int[] fixedCapacities = { 8, 7, 6 };

        for (String city : cities) {
            List<Family> cityFamilies = new ArrayList<>();
            synchronized (globalPassengerList) {
                for (Family family : globalPassengerList) {
                    if (family.travelTo.equals(city)) {
                        cityFamilies.add(family);
                    }
                }
                globalPassengerList.removeAll(cityFamilies);//уникнення дублювання, а також щоб інші ітерації (по інших містах) не включали вже оброблені сім'ї
            }

            cityFamilies.sort((f1, f2) -> Integer.compare(f2.count, f1.count));

            int capacityIndex = 0;
            while (!cityFamilies.isEmpty()) {
                int capacity = fixedCapacities[capacityIndex];
                capacityIndex = (capacityIndex + 1) % fixedCapacities.length;

                Bus bus = new Bus(capacity, city);
                int currentLoad = 0;
                List<Family> familiesToAdd = new ArrayList<>();
                for (int i = 0; i < cityFamilies.size(); i++) {
                    Family family = cityFamilies.get(i);
                    if (currentLoad + family.count <= capacity) {
                        familiesToAdd.add(family);
                        currentLoad += family.count;
                    }
                    if (currentLoad == capacity) {
                        break;
                    }
                }

                for (Family family : familiesToAdd) {
                    bus.addFamily(family);
                    cityFamilies.remove(family);
                }

                if (!bus.passengers.isEmpty()) {
                    buses.add(bus);
                }
            }
        }

        return buses;
    }

    public List<Bus> getBuses() {
        return new ArrayList<>(buses);
    }

    public void addBuses(List<Bus> newBuses) {
        buses.addAll(newBuses);
    }
}