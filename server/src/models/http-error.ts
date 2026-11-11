class HttpError extends Error {
    code: number;

    constructor(errorMessage: string, errorCode: number) {
        super(errorMessage);
        this.code = errorCode;
    }
}

export default HttpError;
