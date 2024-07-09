import mongoose from "mongoose"

const connectionString = process.env.MONGO_DB_URI

if(!connectionString){
    throw new Error("Please provide a valid string")
}

const connectDB = async() => {
    if(mongoose.connection?.readyState >=1){
        return;
    }

    try {
        console.log("Connecting to mongoDB");
        await mongoose.connect(connectionString);
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
}

export default connectDB