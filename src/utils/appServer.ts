import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import config from "../config/config.js";
import indexRouter from "../routes/index.route.js";
import CustomError from "./customError.js";

const { port }: { port: number | string } = config.server;

class AppServer {
	app: express.Application = express();
	server: http.Server | null = null;

	static create(): AppServer {
		return new AppServer();
	}

	init(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cors());
		this.app.use(cookieParser());
	}

	build(): void {
		this.app.use("/api", indexRouter);

		this.app.use(
			(
				err: CustomError,
				req: express.Request,
				res: express.Response,
				next: express.NextFunction
			) => {
				const status = err.status || 500;
				const message = err.message || "";
				console.log(message);
				res.status(status).send(message);
			}
		);
	}

	listen(): void {
		this.server = this.app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}`);
		});
	}

	callBack(): express.Application {
		return this.app;
	}
}

export default AppServer;
