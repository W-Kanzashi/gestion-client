import Link from "next/link";
import { useState } from "react";
import { AiFillFolderAdd } from "react-icons/ai";
import { BsFillFilePersonFill, BsFillGearFill } from "react-icons/bs";

{
  /* Internal link */
}
const links: { href: string; key: string; icon: JSX.Element }[] = [
  { href: "/", key: "Accueil", icon: <BsFillFilePersonFill /> },
  {
    href: "/CreateClient",
    key: "Ajouter client",
    icon: <AiFillFolderAdd />,
  },
  { href: "/Config", key: "Configuration", icon: <BsFillGearFill /> },
];

export default function Navbar() {
  const [openTab, setOpenTab] = useState("/");

  return (
    <nav className="fixed bottom-0 left-0 z-10 flex h-12   w-full flex-row items-center justify-between">
      {links.map((link) => (
        <Link href={link.href} key={link.key}>
          <a
            className={
              "flex h-full w-full basis-1/3 items-center justify-center text-xl " +
              (openTab === link.href
                ? "h-full w-full basis-1/3 bg-slate-800 text-orange-500"
                : "border-2 border-slate-800 bg-white text-slate-800")
            }
            onClick={() => {
              setOpenTab(link.href);
            }}
          >
            {link.icon}
          </a>
        </Link>
      ))}
    </nav>
  );
}
