import { useState } from "react";

interface CategoryFormProps {
    categories: string[];
    onSave: (name: string) => void;
}

export default function CategoryForm({ categories, onSave }: CategoryFormProps) {
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave(name);
        setName("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-4"
        >
            <h2 className="text-lg font-semibold text-indigo-600">Nieuwe Categorie</h2>

            <input
                type="text"
                placeholder="Categorie naam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />


            <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
                Toevoegen
            </button>

            {categories.length > 0 && (
                <ul className="mt-2 space-y-1">
                    {categories.map((c, i) => (
                        <li
                            key={i}
                            className="px-2 py-1 bg-gray-100 rounded-md text-gray-800"
                        >
                            {c}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
}
