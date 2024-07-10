import config from "./config/config";
import AppServer from "./utils/appServer";
import MongoDbConnect from "./utils/dbConnect";
const { url } = config.mongo;
const runApp = () => {
    const db = MongoDbConnect.create();
    db.init(url);
    const app = AppServer.create();
    app.init();
    app.build();
    app.listen();
};
runApp();
