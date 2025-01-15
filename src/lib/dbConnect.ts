import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection : ConnectionObject = {};

async function dbConnect() : Promise<void> {
   if(connection.isConnected) {
    console.log("Already connected");
    return;
   }6

   try{
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

    connection.isConnected = db.connections[0].readyState

    console.log("db connected succesfully")
   }catch(error){

    console.log("db connection failed")

    console.log("error connecting db" , error)
    process.exit(1)
   }
   
}


export default dbConnect;