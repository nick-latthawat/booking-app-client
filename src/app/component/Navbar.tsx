"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaSearch, FaSuitcase, FaUser } from "react-icons/fa";

export default function Navbar() {
    const [active, setActive] = useState("explore");

    const pathname = usePathname();

    const navItems = [
        { href: "/", id: "home", label: "Home", icon: <FaHome /> },
        { href: "/explore", id: "explore", label: "Explore", icon: <FaSearch /> },
        { href: "/trips", id: "trips", label: "Trips", icon: <FaSuitcase /> },
        { href: "/profile", id: "profile", label: "Profile", icon: <FaUser /> },
    ];

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);


    return (

        <nav className="lg:rounded-tr-2xl lg:rounded-br-2xl lg:rounded-tl-none lg:rounded-bl-none 
        rounded-br-none rounded-tl-2xl rounded-tr-2xl rounded-bl-none bg-[rgb(45,61,223)] 
        fixed bottom-0 left-0 w-full shadow-md flex justify-around items-center py-2 
        lg:static lg:flex-col lg:h-screen lg:w-20 lg:shadow-none
        h-20
        "
        >
            {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`cursor-pointer flex flex-col items-center gap-1 text-xs md:my-4 text-white p-4"
                                }`}
                    >
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full 
                            ${active ? "bg-white text-blue-600 shadow-md" : "text-white"}`}
                        >
                            <span className="text-lg">{item.icon}</span>
                        </div>
                        <span className="block">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
