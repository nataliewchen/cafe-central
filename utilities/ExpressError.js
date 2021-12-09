class ExpressError extends Error {
    constructor(_message, _statusCode) {
        super();
        this.message = _message;
        this.statusCode = _statusCode;
    }
}

module.exports = ExpressError;