import { MongoClient, ObjectId } from "mongodb";
import sanitize from "mongo-sanitize";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

interface Client {
  _id: string;
  client: string;
  date: Date;
  work: string;
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

  const conn = connectDB();
  const objId = new ObjectId();
  let result: any;
  try {
    await conn.connect();

    const database = conn.db("insertDB");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts
    const client = database.collection<Client>("work");
    result = await client.insertOne({
      _id: sanitize(objId.toHexString()),
      client: sanitize(data._id),
      date: sanitize(data.date),
      work: sanitize(data.work),
    });
  } finally {
    conn.close();
  }

  console.log(result);
  if (result.insertedId !== null) {
    res.json({ message: "201", success: true });
  } else {
    res.json({ message: "404", success: false });
  }
}

async function find(req: any, res: any) {
  type ClientInfo = Pick<Client, "date" | "work">;

  const data = req.body;

  /* Insert MongoDB authentication */
  const conn = connectDB();

  let result = null;
  try {
    /* Connect to Mongo database */
    await conn.connect();

    /* Use the database insertDB */
    const database = conn.db("insertDB");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts
    const client = database.collection<Client>("work");

    /* Build the query with data send by user */
    let query: FindClient = {};
    data.firstname === "" ? null : (query.firstname = data.firstname);
    data.lastname === "" ? null : (query.lastname = data.lastname);

    /* Query to database : find client, sort by ascending and convert to array */
    result = await client
      .find<ClientInfo>(query)
      .sort({ username: "asc" })
      .toArray();

    /* Close the connexion to database */
    conn.close();

    return res.json({
      message: JSON.parse(JSON.stringify(result)),
      success: true,
    });
  } catch (error: any) {
    /* Check if there is error */
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function deleteEvent(req: any, res: any) {
  const data = req.body;
  let response: any;
  /* Insert MongoDB authentication */
  const conn = connectDB();

  try {
    /* Connect to Mongo database */
    await conn.connect();

    /* Use the database insertDB */
    const database = conn.db("insertDB");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts
    const client = database.collection<Client>("work");

    const query = { id: sanitize(data.client) };
    /* Query to database : find client meeting event and delete the event */
    response = await client.deleteOne(query);
  } finally {
    conn.close();
  }

  /* Return the database response to the query */
  if (response.deletedCount === 0) {
    res.json({ message: "404", success: false });
  } else {
    res.json({ message: "200", success: true });
  }
}

export default withApiAuthRequired(async function handler(req: any, res: any) {
  /* Select the right request */
  switch (req.method) {
    case "POST":
      return await insert(req, res);
    case "GET":
      return await find(req, res);
    case "DELETE":
      return await deleteEvent(req, res);
    default:
      break;
  }
});
