import Link from "next/link";

export default function DisplayClient({ clients = [] }: any) {
  return (
    <>
      <div className="h-full w-full">
        <h2 className="mb-10 ml-4 text-xl font-bold">Liste des clients</h2>
        <div className="flex flex-col divide-y-2 divide-slate-800 border-slate-800 px-5 py-3 xl:border-2">
          {clients.map((client: any) => (
            <Link
              href={`/Client/${encodeURIComponent(client._id)}`}
              key={client._id}
            >
              <a className="flex flex-col px-5 py-2 hover:bg-slate-200">
                <button type="button" className="text-left">
                  <h2>Nom : {client.username}</h2>
                  <h3>Prénom : {client.name}</h3>
                  <h3>Adresse : {client.address}</h3>
                </button>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
