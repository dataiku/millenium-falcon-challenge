package com.dataiku.millennium.db.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name="routes")
@IdClass(Route.class)
public class Route {
        @Id
        String origin;
        @Id
        String destination;
        @Id
        int travelTime;

        public Route(String origin, String destination, int travelTime) {
                this.origin = origin;
                this.destination = destination;
                this.travelTime = travelTime;
        }

        public Route() {

        }

        public String origin() {
                return origin;
        }

        public void setOrigin(String origin) {
                this.origin = origin;
        }

        public String destination() {
                return destination;
        }

        public void setDestination(String destination) {
                this.destination = destination;
        }

        public int travelTime() {
                return travelTime;
        }

        public void setTravelTime(int travelTime) {
                this.travelTime = travelTime;
        }
}
