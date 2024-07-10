import config from "./config/config.js";
import AppServer from "./utils/appServer.js";
import MongoDbConnect from "./utils/dbConnect.js";

class App {
	private db: MongoDbConnect;
	private app: AppServer;

	constructor() {
		const { url }: { url: string } = config.mongo;
		this.db = MongoDbConnect.create();
		this.db.init(url);

		this.app = AppServer.create();
		this.app.init();
		this.app.build();
	}

	public getExpressApp() {
		return this.app.callBack();
	}

	public listen() {
		this.app.listen();
	}
}

// Create and export a single instance of the App
const app = new App();
export default app;

// If you want to run the server locally
if (process.env.NODE_ENV !== "production") {
	app.listen();
}

// Export the Express app for Vercel
export const vercelHandler = app.getExpressApp();
