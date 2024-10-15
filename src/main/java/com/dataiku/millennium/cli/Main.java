package com.dataiku.millennium.cli;

import com.dataiku.millennium.cli.db.DatabaseConnector;
import com.dataiku.millennium.cli.db.RouteRepository;
import com.dataiku.millennium.model.config.MillenniumConfig;
import com.dataiku.millennium.core.Graph;
import com.dataiku.millennium.model.EmpireContext;
import com.dataiku.millennium.db.entity.Route;
import com.dataiku.millennium.util.ObjectMapperFactory;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Logger;

public class Main {
    private static final Logger logger = Logger.getLogger(Main.class.getName());

    public static void main(String[] args) {
        if (args.length != 2) {
            logger.severe("Error, input two arguments <millennium-falcon.json> <empire.json>");
            return;
        }

        try {
            String millenniumConfigFilePath = args[0];
            String empireFilePath = args[1];

            MillenniumConfig config = loadConfig(millenniumConfigFilePath, MillenniumConfig.class);
            EmpireContext context = loadConfig(empireFilePath, EmpireContext.class);

            Connection connection = DatabaseConnector.connectToDatabase(config.routesDb(), millenniumConfigFilePath);
            RouteRepository routeRepository = new RouteRepository(connection);
            List<Route> routes = routeRepository.getRoutesFromDB();
            Graph graph = new Graph(config.getGraphProperties());
            graph.initializeGraph(routes);

            int percentageProbability = graph.traverse(context);

            logger.info("Chance of survival: " + percentageProbability + "%");
        } catch (IOException e) {
            logger.severe("Error while reading configuration files: " + e.getMessage());
        } catch (SQLException e) {
            logger.severe("Error while connecting to the database: " + e.getMessage());
        }
    }

    private static <T> T loadConfig(String filePath, Class<T> configClass) throws IOException {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IOException("File not found: " + filePath);
        }
        return ObjectMapperFactory.getObjectMapper().readValue(file, configClass);
    }
}


/*
 *
 * Make all class attributes final.
 * Write unit test for Graph
 * Add title/picture for front-end.
 * Readme.md
 */