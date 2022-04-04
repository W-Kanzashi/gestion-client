import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import EditMode from "@components/Client/EditMode";
import ShowMode from "@components/Client/ShowMode";
import Loading from "@components/Loading";

export default function Client(props: any) {
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

  const router = useRouter();
  const { client } = router.query;

  const fetcher = async (url: string): Promise<any> => {
    const response = await fetch(url, {
      method: "GET",
    });
    const data = response.json();
    return data;
  };

  const { data, error } = useSWR(
    client ? `/api/user/${client}` : null,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <Loading />;

  return (
    <section className="mx-auto max-w-7xl">
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
