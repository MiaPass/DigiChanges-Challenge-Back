import config from "./config/config.js";
import AppServer from "./utils/appServer.js";
import MongoDbConnect from "./utils/dbConnect.js";

const { url }: { url: string } = config.mongo;

const runApp = (): void => {
	const db = MongoDbConnect.create();
	db.init(url);

	const app = AppServer.create();
	app.init();
	app.build();
	app.listen();
};

runApp();
