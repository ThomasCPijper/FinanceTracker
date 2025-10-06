import { Link, useLocation } from "@remix-run/react";

interface NavButtonProps {
    to: string;
    label: string;
}

export default function NavButton({ to, label }: NavButtonProps) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`
        block text-left px-4 py-2 rounded-lg font-medium
        transition-colors duration-200
        ${isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"}
      `}
        >
            {label}
        </Link>
    );
}
