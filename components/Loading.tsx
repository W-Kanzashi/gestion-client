export default function Loading() {
  return (
    <section className="mx-auto flex h-screen max-w-6xl flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold">
        Veuillez Patientez pendant que la page se charge...
      </h1>
      <p className="text-xl">Le chagement peut être lent</p>
    </section>
  );
}
