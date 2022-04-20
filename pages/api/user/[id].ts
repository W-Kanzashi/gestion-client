import sanitize from "mongo-sanitize";
import { connectDB } from "@api/connectDB";
import Clients from "types/Clients";
import Works from "types/Works";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function findOne(req: any, res: any) {
  // Check if the type if "date" or work
  type WorkInfo = Pick<Works, "date" | "work">;
  // Connect to database
  const conn = connectDB();
  await conn.connect();
  // Select the database
  const database = conn.db("insertDB");

  /* Retrieve client data */
  const clients = database.collection<Clients>("client");
  // file deepcode ignore Sqli: using mongo-sanitize package -- Ignore this line because Snyk is not able to detect sanitize function and display it as a sql injection
  const client = await clients.findOne({
    _id: sanitize(req.query.id),
  });

  /* Retrieve todo work */
  const works = database.collection<Works>("work");
  // file deepcode ignore Sqli: using mongo-sanitize package
  // Get the client work and sort it by date and convert it to array
  const work = await works
    .find<WorkInfo>({
      client: sanitize(req.query.id),
    })
    .sort({ date: "asc" })
    .toArray();

  conn.close();

  // Return the data to the client
  res.status(200).json({ client, work });
});
