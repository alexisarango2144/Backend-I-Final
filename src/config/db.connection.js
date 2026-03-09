import { connect, mongo } from "mongoose";
import "dotenv/config";

export const initMongoDB = async ()=> {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if(!mongoUrl) throw new Error("MONGO_URL is not defined");
    await connect(mongoUrl);
  } catch (error) {
    throw new Error("Ocurrió un error de conexión con la base de datos");
  }
}
