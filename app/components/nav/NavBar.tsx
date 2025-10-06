import NavButton from "./NavButton";

export default function Navbar() {
    return (
        <aside className="w-full sm:w-72 bg-white shadow-lg p-6 flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-indigo-600">Finance Dashboard</h1>

            <nav className="flex flex-col gap-2">
                <NavButton to="/dashboard" label="Dashboard" />
                <NavButton to="/categories" label="Categories" />
            </nav>
        </aside>
    );
}
