import sanitize from "mongo-sanitize";
import { connectDB } from "@api/connectDB";
import Clients from "types/Clients";
import Works from "types/Works";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function findOne(req: any, res: any) {
  type WorkInfo = Pick<Works, "date" | "work">;
  const conn = connectDB();
  await conn.connect();
  const database = conn.db("insertDB");

  /* Retrieve client data */
  const clients = database.collection<Clients>("client");
  // file deepcode ignore Sqli: using mongo-sanitize package
  const client = await clients.findOne({
    _id: sanitize(req.query.id),
  });

  /* Retrieve todo work */
  const works = database.collection<Works>("work");
  // file deepcode ignore Sqli: using mongo-sanitize package
  const work = await works
    .find<WorkInfo>({
      client: sanitize(req.query.id),
    })
    .sort({ date: "asc" })
    .toArray();

  conn.close();

  res.status(200).json({ client, work });
});
