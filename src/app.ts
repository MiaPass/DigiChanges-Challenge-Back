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

const app = new App();

app.listen();

export default app.getExpressApp();
