import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Config() {
  return <></>;
}

export const getServerSideProps = withPageAuthRequired();
