package com.dataiku.millennium.cli.util;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

public final class PathResolver {
    private PathResolver() {}

    /**
     * Supports reading both absolute and relative DB paths. If the DB path is relative,
     * we resolve it according to the `referencePath`.
     * @param routesDb
     * @param referencePath
     * @return absolute path for the DB.
     */
    public static String resolveDatabasePath(String routesDb, String referencePath) {
        File dbPath = new File(routesDb);

        if (dbPath.isAbsolute()) {
            return routesDb;
        }

        Path jsonPath = Paths.get(referencePath).toAbsolutePath().getParent();
        Path resolvedDbPath = jsonPath.resolve(routesDb).normalize();

        return resolvedDbPath.toString();
    }
}
