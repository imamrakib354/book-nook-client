import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);


const db = client.db("BookNookDB");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    
    database: mongodbAdapter(db, {
        client,
        transaction: false,
    }),
});