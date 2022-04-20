import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";
import CreateClient from "@components/Form/CreateClient";

import Loading from "@components/Loading";
import Error from "@components/Error";

/**
 * Create client page
 * @returns JSX.Element
 */
export default function Client() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <Error errorCode={error.message} />;

  if (user) {
    return (
      <section className="mx-auto max-w-5xl px-2 py-5">
        <h1 className="pb-10 text-3xl font-bold">Création d&apos;un client</h1>
        <CreateClient />
      </section>
    );
  }
}
// Display the login page if the user is not authenticated
export const getServerSideProps = withPageAuthRequired();
