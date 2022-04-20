import Link from "next/link";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";

import Loading from "@components/Loading";
import Error from "@components/Error";

export default function Config() {
  // Get the authenticated user
  const { user, error, isLoading } = useUser();

  // Wait for the api response
  if (isLoading) return <Loading />;
  // If there was an error, show it
  if (error) return <Error errorCode={error.message} />;
  // If there is data display it
  return (
    user && (
      <>
        <main>
          <section className="flex h-screen w-full flex-col items-center justify-center gap-10">
            <div className="rounded-xl bg-slate-800 px-10 py-6 text-slate-100 shadow-lg">
              <h2 className="text-2xl">Utilisateur : {user.name}</h2>
              <p className="text-xl">Email : {user.email}</p>
            </div>
            {/* Link to the auth0 logout api */}
            <Link href="/api/auth/logout">
              <a className="button">Déconnexion</a>
            </Link>
          </section>
        </main>
      </>
    )
  );
}
// Display the login page if the user is not authenticated
export const getServerSideProps = withPageAuthRequired();
