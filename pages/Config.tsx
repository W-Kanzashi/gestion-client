import Link from "next/link";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";

import Loading from "@components/Loading";
import Error from "@components/Error";

export default function Config() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <Error errorCode={error.message} />;
  return (
    user && (
      <>
        <main>
          <section className="flex h-screen w-full flex-col items-center justify-center gap-10">
            <div className="rounded-xl bg-slate-800 px-10 py-6 text-slate-100 shadow-lg">
              <h2 className="text-2xl">Utilisateur : {user.name}</h2>
              <p className="text-xl">Email : {user.email}</p>
            </div>
            <Link href="/api/auth/logout">
              <a className="button">Déconnexion</a>
            </Link>
          </section>
        </main>
      </>
    )
  );
}

export const getServerSideProps = withPageAuthRequired();
