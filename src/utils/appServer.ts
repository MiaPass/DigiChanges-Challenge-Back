import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import config from "../config/config.js";
import indexRouter from "../routes/index.route.js";
import CustomError from "./customError.js";

const {
	port,
	url,
}: {
	port: number | string;
	url: string | null;
} = config.server;

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
		this.app.use(
			(
				req: express.Request,
				res: express.Response,
				next: express.NextFunction
			) => {
				res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Credentials", "true");
				res.header(
					"Access-Control-Allow-Headers",
					"Origin, X-Requested-With, Content-Type, Accept"
				);
				res.header(
					"Access-Control-Allow-Methods",
					"GET, POST, OPTIONS, PUT, DELETE"
				);
				next();
			}
		);
	}

	build(): void {
		this.app.use("/api", indexRouter);
		this.app.use(
			(err: CustomError, req: express.Request, res: express.Response) => {
				const status = err.status || 500;
				const message = err.message || "";
				res.status(status).send(message);
			}
		);
	}

	listen(): void {
		url
			? (this.server = this.app.listen(url, () => {
					console.log(`Server running on ${url}`);
			  }))
			: (this.server = this.app.listen(port, () => {
					console.log(`Server running on http://localhost:${port}`);
			  }));
	}

	// Add this method to get the Express app
	callBack(): express.Application {
		return this.app;
	}
}

export default AppServer;
