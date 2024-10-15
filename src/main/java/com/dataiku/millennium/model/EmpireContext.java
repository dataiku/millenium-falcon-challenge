package com.dataiku.millennium.model;

import java.util.Set;

public record EmpireContext(
        Set<BountyHunter> bountyHunters,
        int countdown
) {
    public boolean hasHunter(String name, int day) {
        return bountyHunters.contains(new BountyHunter(name, day));
    }
}
