import config from "./config/config";
import AppServer from "./utils/appServer";
import MongoDbConnect from "./utils/dbConnect";

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
