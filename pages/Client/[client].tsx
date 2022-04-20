import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import EditMode from "@components/Client/EditMode";
import ShowMode from "@components/Client/ShowMode";
import Loading from "@components/Loading";
import Error from "@components/Error";

/**
 * Dynamic client information page
 * @returns JSX.Element
 */

export default function Client() {
  /* State the Validate button */
  const [validateButton, setValidateButton] = useState(true);

  /* State the edit button */
  const [editMode, setEditMode] = useState(false);

  /* Edit the state of the validate button */
  function handleChange(): void {
    setValidateButton(false);
  }
  /* Edit the state of the edit button */
  function handleEditMode(): void {
    setEditMode(!editMode);
  }

  // Use the internal router
  const router = useRouter();
  // Get the client id from the url
  const { client } = router.query;

  // Get the client info
  const fetcher = async (url: string): Promise<any> => {
    const response = await fetch(url, {
      method: "GET",
    });
    const data = response.json();
    return data;
  };

  // Use SWR to fech the client info
  const { data, error } = useSWR(
    client ? `/api/user/${client}` : null,
    fetcher
  );

  if (error) return <Error errorCode={error.message} />;
  if (!data) return <Loading />;

  return (
    <section className="mx-auto max-w-7xl">
      {/* Change between edition and show client data */}
      {editMode ? (
        <EditMode
          client={data.client}
          work={data.work}
          setValidateButton={handleChange}
          validateButton={validateButton}
          setEditMode={handleEditMode}
          editMode={editMode}
        />
      ) : (
        <ShowMode
          client={data.client}
          work={data.work}
          setEditMode={handleEditMode}
          editMode={editMode}
        />
      )}
    </section>
  );
}

export const getServerSideProps = withPageAuthRequired();
