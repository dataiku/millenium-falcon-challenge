package com.dataiku.millennium.cli.db;

import com.dataiku.millennium.cli.util.PathResolver;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnector {
    private static final String JDBC_PREFIX = "jdbc:sqlite:";

    public static Connection connectToDatabase(String dbPath, String referencePath) throws SQLException {
        String resolvedPath = PathResolver.resolveDatabasePath(dbPath, referencePath);
        String url = JDBC_PREFIX + resolvedPath;
        return DriverManager.getConnection(url);
    }
}
