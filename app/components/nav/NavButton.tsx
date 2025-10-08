import { Link, useLocation } from "@remix-run/react";
import { Home, Layers, User } from "lucide-react"; // icons

interface NavButtonProps {
    to: string;
    label: string;
    icon?: "home" | "categories" | "profile"; // optioneel type voor icon keuze
}

export default function NavButton({ to, label, icon }: NavButtonProps) {
    const location = useLocation();
    const isActive = location.pathname === to;

    // simpele icon mapping
    const icons = {
        home: <Home size={18} />,
        categories: <Layers size={18} />,
        profile: <User size={18} />,
    };

    return (
        <Link
            to={to}
            className={`
        flex items-center gap-3 sm:gap-2 justify-center sm:justify-start
        px-4 py-3 rounded-xl font-medium
        transition-all duration-200 ease-in-out
        text-sm sm:text-base select-none
        ${isActive ? "bg-indigo-600 text-white shadow-md" : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"}
      `}
        >
            {icon && <span>{icons[icon]}</span>}
            <span>{label}</span>
        </Link>
    );
}
