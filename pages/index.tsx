import Head from "next/head";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import { connectDB } from "./api/connectDB";
import DisplayAllClient from "@components/DisplayAllClient";
import Clients from "types/Clients";

import Loading from "@components/Loading";
import Error from "@components/Error";

/**
 * Home page that dipslay all clients
 * @param { clients }
 * @returns
 */
export default function Home({ clients }: any) {
  const [inputLastname, setInputLastname] = useState("");
  const [inputFirstname, setInputFirstname] = useState("");
  const { user, error, isLoading } = useUser();
  const history = useRouter();

  // Search by lastname
  function inputHandlerLastname(e: any) {
    //convert input text to lower case
    let lowerCase = e.target.value.toLowerCase();
    setInputLastname(lowerCase);
  }

  // Search by firstname
  function inputHandlerFirstname(e: any) {
    //convert input text to lower case
    let lowerCase = e.target.value.toLowerCase();
    setInputFirstname(lowerCase);
  }

  if (isLoading) return <Loading />;
  if (error) return <Error errorCode={error.message} />;

  if (user) {
    return (
      <div>
        <Head>
          <title>SEVIVO - Gestion Client</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="mx-auto max-w-7xl flex-col px-5 text-slate-800 2xl:px-0">
          <div className="flex flex-col gap-10 xl:flex-row">
            <section className="flex flex-col gap-10">
              <h2 className="text-3xl font-bold">Liste des Clients</h2>
              <div className="flex flex-col gap-10">
                <TextField
                  label="Nom"
                  color="secondary"
                  focused
                  onChange={inputHandlerLastname}
                />
                <TextField
                  label="Prénom"
                  color="secondary"
                  focused
                  onChange={inputHandlerFirstname}
                />
              </div>
            </section>
            <DisplayAllClient
              clients={clients}
              lastname={inputLastname}
              firstname={inputFirstname}
            />
          </div>
        </main>
      </div>
    );
  }
  return history.push("/api/auth/login");
}

// Generate the page on the server and send the page to the user
// Check Next js getServerSideProps for more information
export async function getServerSideProps() {
  // Not mandatory but intelisense will work
  type ClientInfo = Pick<Clients, "firstname" | "lastname">;

  /* Insert MongoDB authentication */
  const conn = connectDB();

  // To store all clients
  let result = null;
  try {
    /* Connect to Mongo database */
    await conn.connect();

    /* Use the database insertDB */
    const database = conn.db("insertDB");
    // Specifying a Schema is optional, but it enables type hints on
    // finds and inserts
    const client = database.collection<Clients>("client");

    /* Query to database : find client, sort by ascending and convert to array */
    result = await client
      .find<ClientInfo>({})
      .sort({ username: "asc" })
      .toArray();
  } finally {
    /* Close the connexion to database */
    conn.close();
  }

  return {
    props: {
      // Pass the data to the page via props
      clients: JSON.parse(JSON.stringify(result)),
    },
  };
}
