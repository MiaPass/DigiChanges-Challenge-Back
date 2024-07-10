class CustomError extends Error {
    constructor(status, code, message) {
        super();
        this.message = message;
        this.code = code;
        this.status = status;
    }
}
export default CustomError;
