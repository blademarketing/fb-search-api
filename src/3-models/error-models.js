import { StatusCode } from "./status-code.js";

class ClientError {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}

export class BadRequestError extends ClientError {
    constructor(message) {
        super(StatusCode.BadRequest, message);
    }
}

export class UnauthorizedError extends ClientError {
    constructor(message) {
        super(StatusCode.Unauthorized, message);
    }
}

export class ForbiddenError extends ClientError {
    constructor(message) {
        super(StatusCode.Forbidden, message);
    }
}

export class NotFoundError extends ClientError {
    constructor(message) {
        super(StatusCode.NotFound, message);
    }
}
