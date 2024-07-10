import mongoose from "mongoose";
class MongoDbConnection {
    static create() {
        return new MongoDbConnection();
    }
    async init(uri) {
        this.connection = await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }
    async close() {
        if (this.connection) {
            await this.connection.close();
        }
        else {
            throw new Error("Connection is not established");
        }
    }
}
export default MongoDbConnection;
