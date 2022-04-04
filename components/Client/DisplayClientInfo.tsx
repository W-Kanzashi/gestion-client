export default function DisplaClientInfo(props: any) {
  return (
    <section className="flex h-screen basis-[40%] flex-col gap-5 bg-slate-200 py-20 px-5">
      <h3 className="text-lg">
        <span className="text-underline">Nom :</span> {props.client.lastname}
      </h3>
      <h3 className="text-lg">
        <span className="text-underline">Prénom :</span>{" "}
        {props.client.firstname}
      </h3>
      <h3 className="text-lg">
        <span className="text-underline">Entreprise :</span>{" "}
        {props.client.company}
      </h3>
      <h3 className="text-lg">
        <span className="text-underline">Adresse :</span>{" "}
        <a
          href={"https://www.google.com/maps/place/" + props.client.address}
          target="_blank"
          rel="noreferrer noopener"
          className="text-teal-500 hover:text-teal-600 hover:drop-shadow-sm"
        >
          <span>{props.client.address}</span>
        </a>
      </h3>
      <h3 className="text-lg">
        <span className="text-underline">Code Postal :</span> {props.client.cp}
      </h3>
      <h3 className="text-lg">
        <span className="text-underline">Ville :</span> {props.client.city}
      </h3>
      <h3 className="text-lg">
        <span className="text-underline">Tél :</span>{" "}
        <a
          href={"tel:" + props.client.tel}
          title="Client Tel"
          className="text-teal-500 hover:text-teal-600 hover:drop-shadow-sm"
        >
          <span>{props.client.tel}</span>
        </a>
      </h3>
      <h3 className="text-lg">
        <span className="text-underline">Fixe :</span>{" "}
        <a
          href={"tel:" + props.client.phone}
          title="Client Phone"
          className="text-teal-500 hover:text-teal-600 hover:drop-shadow-sm"
        >
          <span>{props.client.phone}</span>
        </a>
      </h3>
      <h3 className="text-lg">
        <span className="text-underline">Email :</span>{" "}
        <a
          href={"mailto:" + props.client.email}
          title="Client Email"
          className="text-teal-500 hover:text-teal-600 hover:drop-shadow-sm"
        >
          <span>{props.client.email}</span>
        </a>
      </h3>
      <h3 className="text-lg">
        <span className="text-underline">Informations complémentaires :</span>
        <br />
        {props.client.info}
      </h3>
    </section>
  );
}
