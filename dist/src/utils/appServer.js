import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "../config/config";
import indexRouter from "../routes/index.route";
const { port } = config.server;
class AppServer {
    constructor() {
        this.app = express();
        this.server = null;
    }
    static create() {
        return new AppServer();
    }
    init() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(cookieParser());
    }
    build() {
        this.app.use("/api", indexRouter);
        this.app.use((err, req, res) => {
            const status = err.status || 500;
            const message = err.message || "";
            res.status(status).send(message);
        });
    }
    listen() {
        this.server = this.app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}
export default AppServer;
