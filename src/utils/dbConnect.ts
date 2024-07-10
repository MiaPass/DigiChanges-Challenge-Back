import mongoose from "mongoose";

class MongoDbConnection {
	connection: any;
	static create(): MongoDbConnection {
		return new MongoDbConnection();
	}

	async init(uri: string): Promise<void> {
		this.connection = await mongoose.connect(uri);
		console.log("Connected to MongoDB");
	}

	async close(): Promise<void> {
		if (this.connection) {
			await this.connection.close();
		} else {
			throw new Error("Connection is not established");
		}
	}
}

export default MongoDbConnection;
