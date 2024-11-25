import cors from "cors";
import express from "express";
import { appConfig } from "./2-utils/app-config.js";
import { facebookController } from "./5-controllers/facebook-controller.js";
import { errorMiddleware } from "./6-middleware/error-middleware.js";
import { loggerMiddleware } from "./6-middleware/logger-middleware.js";

class App {

    async start() {
        const server = express();
        server.use(cors());
        server.use(express.json());
        server.use(loggerMiddleware.consoleLogRequest);
        server.use("/api", facebookController.router);
        server.use("*", errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);
        server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
    }

}

const app = new App();
app.start();
