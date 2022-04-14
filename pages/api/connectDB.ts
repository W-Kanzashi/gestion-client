import { MongoClient, ObjectId } from "mongodb";
import sanitize from "mongo-sanitize";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

interface Client {
  _id: string;
  firstname: string;
  lastname: string;
  company: string;
  address: string;
  email: string;
  cp: string;
  city: string;
  tel: string;
  phone: string;
  info: string;
}

interface FindClient {
  [index: string]: string;
}

export function connectDB(): MongoClient {
  // Replace the uri string with your MongoDB deployment's connection string.
  const uri = <string>process.env.MONGODB_URI;
  const conn = new MongoClient(uri, { enableUtf8Validation: true });

  return conn;
}

async function insert(req: any, res: any): Promise<void> {
  const data = req.body;

  /* Insert MongoDB authentication */
  const conn = connectDB();

  const objId = new ObjectId();
  try {
    await conn.connect();

    const database = conn.db("insertDB");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts
    const client = database.collection<Client>("client");
    const result = await client.insertOne({
      _id: sanitize(objId.toHexString()),
      firstname: sanitize(data.firstname),
      lastname: sanitize(data.lastname),
      company: sanitize(data.company),
      address: sanitize(data.address),
      email: sanitize(data.email),
      cp: sanitize(data.cp),
      city: sanitize(data.city),
      tel: sanitize(data.tel),
      phone: sanitize(data.phone),
      info: sanitize(data.info),
    });
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    conn.close();
  }

  res.status(201).json({ message: "201" });
}

async function updateOne(req: any, res: any) {
  const data = req.body;
  let clientInfo: any;
  /* Insert MongoDB authentication */
  const conn = connectDB();

  try {
    /* Connect to Mongo database */
    await conn.connect();

    /* Use the database insertDB */
    const database = conn.db("insertDB");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts
    const client = database.collection<Client>("client");

    /* Get the id of the client */
    const filter = { _id: sanitize(data._id) };
    delete data._id;

    /* Update the client data with new data */
    const updateDocument = {
      $set: data,
    };

    /* Query to database : update the client data */
    clientInfo = await client.updateOne(filter, updateDocument);
    console.log("Client info");
    console.log(clientInfo);
  } finally {
    await conn.close();
  }
  if (clientInfo.modifiedCount === 0 && clientInfo.matchedCount !== 0) {
    res.json({
      message: "Aucunes modifications n'a été effectué.",
      success: false,
    });
  } else if (clientInfo.modifiedCount === 0) {
    res.json({
      message:
        "Une erreur a été produite. Veuillez informer la personne en charge.",
      success: false,
    });
  } else {
    res.json({ message: "200", success: true });
  }
}

async function deleteOne(req: any, res: any) {
  const data = req.body;
  let clientInfo: any;
  /* Insert MongoDB authentication */
  const conn = connectDB();

  try {
    /* Connect to Mongo database */
    await conn.connect();

    /* Use the database insertDB */
    const database = conn.db("insertDB");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts
    const client = database.collection<Client>("client");

    /* Get the id of the client */
    const id = { _id: sanitize(data._id) };

    /* Query to database : update the client data */
    clientInfo = await client.deleteOne(id);
  } finally {
    await conn.close();
  }
  if (clientInfo.deletedCount === 1) {
    res.json({
      message: "200",
      success: true,
    });
  } else {
    res.json({
      message:
        "Une erreur a été produite. Veuillez informer la personne en charge.",
      success: false,
    });
  }
}

export default withApiAuthRequired(async function handler(req: any, res: any) {
  /* Select the right request */
  switch (req.method) {
    case "POST":
      return await insert(req, res);
    case "PATCH":
      return await updateOne(req, res);
    case "DELETE":
      return await deleteOne(req, res);
    default:
      break;
  }
});
