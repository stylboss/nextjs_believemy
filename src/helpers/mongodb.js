import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
  // connexion à mongoDB
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@cluster0.icceu0i.mongodb.net/${process.env.mongodb_db}?retryWrites=true&w=majority`
  );

  return client;
}