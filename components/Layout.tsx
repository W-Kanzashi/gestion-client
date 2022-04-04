import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

export default function Layout({ children }: any) {
  return (
    <>
      <main>{children}</main>
      <Navbar />
    </>
  );
}
