import { useState } from "react";

interface FilterData {
    type: string;
    category: string;
    date: string;
}

interface TransactionFilterProps {
    onFilter: (data: FilterData) => void;
}

export default function TransactionFilter({ onFilter }: TransactionFilterProps) {
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [expanded, setExpanded] = useState(false);

    const handleFilter = () => {
        onFilter({ type, category, date });
    };

    // Tel het aantal actieve filters
    const activeFilters = [type, category, date].filter(Boolean).length;

    return (
        <div className="flex flex-col gap-2">
            {/* Filter badge */}
            <div
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md px-4 py-2"
            >
        <span className="font-medium text-gray-700">
          Filters ({activeFilters})
        </span>
                <span className="text-gray-500">{expanded ? "▲" : "▼"}</span>
            </div>

            {/* Uitklapbare filtervelden */}
            {expanded && (
                <div className="flex flex-col gap-2 mt-2 bg-white p-4 rounded-md shadow-md">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">Alle types</option>
                        <option value="income">Inkomen</option>
                        <option value="expense">Uitgave</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Categorie"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    <input
                        type="month"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    <button
                        onClick={handleFilter}
                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Filteren
                    </button>
                </div>
            )}
        </div>
    );
}
