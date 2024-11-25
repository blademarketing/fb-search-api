import { NotFoundError } from "../3-models/error-models.js";
import { StatusCode } from "../3-models/status-code.js";

class ErrorMiddleware {

    catchAll(err, request, response, next) {
        console.log(err);
        const status = err.status || StatusCode.InternalServerError;
        const message = err.message;
        response.status(status).send(message);
    }

    routeNotFound(request, response, next) {
        next(new NotFoundError(`Route ${request.originalUrl} not found.`));
    }

}

export const errorMiddleware = new ErrorMiddleware();
