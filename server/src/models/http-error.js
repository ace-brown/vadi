class HttpError extends Error {
    constructor(erorrMessage, errorCode) {
        super(erorrMessage)
        this.code = errorCode

    }


}

module.exports = HttpError;