import { useState } from "react";
import SafeDatePicker from "~/components/common/SafeDatePicker";
import {Category} from "@prisma/client";

interface TransactionFilterProps {
    initialStart?: Date;
    initialEnd?: Date;
    initialCategory?: string;
    initialType?: "income" | "expense";
    categories?: Category[];
}

export default function TransactionFilter({
                                              initialStart,
                                              initialEnd,
                                              initialCategory,
                                              initialType,
                                              categories = [],
                                          }: TransactionFilterProps) {
    const [startDate, setStartDate] = useState<Date | null>(initialStart || null);
    const [endDate, setEndDate] = useState<Date | null>(initialEnd || null);
    const [category, setCategory] = useState<string | "">(
        initialCategory || ""
    );
    const [type, setType] = useState<"income" | "expense" | "">(
        initialType || ""
    );

    return (
        <form method="get" className="flex gap-2 items-center flex-wrap">
            <SafeDatePicker selected={startDate} onChange={setStartDate} />
            <input
                type="hidden"
                name="dateStart"
                value={startDate ? startDate.toISOString().substring(0, 10) : ""}
            />

            <SafeDatePicker selected={endDate} onChange={setEndDate} />
            <input
                type="hidden"
                name="dateEnd"
                value={endDate ? endDate.toISOString().substring(0, 10) : ""}
            />

            <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <select
                name="type"
                value={type}
                onChange={(e) =>
                    setType(e.target.value === "" ? "" : (e.target.value as "income" | "expense"))
                }
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>

            <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 text-white rounded"
            >
                Filter
            </button>
        </form>
    );
}
