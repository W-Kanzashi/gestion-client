import { useRouter } from "next/router";

interface ErrorCode {
  errorCode: string;
  message?: string;
}

export default function Error({ errorCode }: ErrorCode) {
  const router = useRouter();
  return (
    <section className="mx-auto flex h-screen max-w-6xl flex-col items-center justify-center gap-10">
      <h1 className="text-3xl font-semibold">
        Une erreur {errorCode} est survenue.
      </h1>
      <button className="button" onClick={() => router.reload()}>
        Réessayer
      </button>
      <p className="text-lg">
        Si cette erreur continue de se produire veuillez l'indiquer à la
        personne en charge.
      </p>
    </section>
  );
}
