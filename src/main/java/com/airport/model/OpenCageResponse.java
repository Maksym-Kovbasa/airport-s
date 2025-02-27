package com.airport.model;

import java.util.List;

public class OpenCageResponse {
    private List<Result> results;

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }

    public static class Result {
        private Components components;

        public Components getComponents() {
            return components;
        }

        public void setComponents(Components components) {
            this.components = components;
        }
    }

    public static class Components {
        private String city;

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }
    }
}
