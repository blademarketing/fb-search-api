class LoggerMiddleware {
    
    consoleLogRequest(request, response, next) {
        console.log("Method: ", request.method);
        console.log("Route: ", request.originalUrl);
        console.log("Body: ", request.body);
        next();
    }

}

export const loggerMiddleware = new LoggerMiddleware();
