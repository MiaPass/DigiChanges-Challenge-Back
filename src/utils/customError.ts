class CustomError extends Error {
	code: number;
	status: number;
	constructor(status: number, code: number, message: string) {
		super();
		this.message = message;
		this.code = code;
		this.status = status;
	}
}

export default CustomError;
