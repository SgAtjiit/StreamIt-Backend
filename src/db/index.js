import mongoose from "mongoose"
import {DB_NAME} from "../constant.js"


const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
        if (uri.endsWith("/")) {
            uri = uri.slice(0, -1);
        }
        const hasDbInUri = (uri.includes("mongodb.net/") && uri.split("mongodb.net/")[1]?.length > 0) ||
                           (uri.includes("27017/") && uri.split("27017/")[1]?.length > 0);
        const connectionString = hasDbInUri ? uri : `${uri}/${DB_NAME}`;
        
        try {
            const connectionInstance = await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 4000 });
            console.log("\n MongoDB connected !!");
            console.log(" DB Host: ", connectionInstance.connection.host);
        } catch (err) {
            if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes("mongodb.net")) {
                console.warn("\n⚠️ Atlas connection unavailable (check IP Whitelist). Falling back to local MongoDB...");
                const localUri = `mongodb://127.0.0.1:27017/${DB_NAME}`;
                const connectionInstance = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 4000 });
                console.log(" MongoDB connected (Local Fallback) !!");
                console.log(" DB Host: ", connectionInstance.connection.host);
            } else {
                throw err;
            }
        }
    } catch (error) {
        console.log("Mongo db connection error :", error);
        process.exit(1);
    }
}

export default connectDB