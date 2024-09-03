import ClientError from "./ClientError.js";

class AuthorizationError extends ClientError {
    constructor(message) {
        super(message, 404);
        this.name = 'AuthorizationError';
    }
}

export default AuthorizationError;
