import NavButton from "./NavButton";

export default function Navbar() {
    return (
        <aside className="w-full sm:w-72 bg-white shadow-lg p-6 flex flex-col h-fit sm:h-screen">
            {/* Header */}
            <h1 className="text-2xl font-bold text-indigo-600 mb-6">Finance Dashboard</h1>

            {/* Navigation links */}
            <nav className="flex flex-col gap-2 flex-1">
                <NavButton to="/dashboard" label="Dashboard" />
                <NavButton to="/categories" label="Categories" />
            </nav>

            {/* Profile button pinned to bottom */}
            <div className="pt-4 border-t border-gray-200">
                <NavButton to="/profile" label="Profile" />
            </div>
        </aside>
    );
}
