import {MongoClient, ServerApiVersion, MongoClientOptions} from 'mongodb';

async function initiateMongoDb() {
    const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 };
    const mongoClient = new MongoClient(process.env.MONGODB_URL || '', mongoOptions);
    await mongoClient.connect((err) => {
        if(err){
            throw err;
        }
        console.log("Mongo Connected")
    });
    return mongoClient;
}

export default initiateMongoDb;
