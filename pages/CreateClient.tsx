import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import CreateClient from "@components/Form/CreateClient";

export default function Client() {
  return (
    <section className="mx-auto max-w-5xl px-2 py-5">
      <h1 className="pb-10 text-3xl font-bold">Création d&apos;un client</h1>
      <CreateClient />
    </section>
  );
}

export const getServerSideProps = withPageAuthRequired();
