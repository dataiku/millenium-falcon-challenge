package com.dataiku.millenium.core;

import java.util.Objects;

public record Node(
        String name,
        int fuel,
        int day,
        int bounty
) {
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Node node = (Node) o;
        return fuel == node.fuel &&
                day == node.day &&
                bounty == node.bounty &&
                Objects.equals(name, node.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, fuel, day, bounty);
    }
}
