import { useState, useRef, useEffect } from "react";
import SafeDatePicker from "~/components/common/SafeDatePicker";
import { Category } from "@prisma/client";
import { Form } from "@remix-run/react";

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
    const [category, setCategory] = useState<string | "">(initialCategory || "");
    const [type, setType] = useState<"income" | "expense" | "">(initialType || "");
    const [open, setOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });

    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Recalculate dropdown position when opened
    useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const dropdownWidth = 288; // 72 * 4px
            let left = rect.left + rect.width / 2 - dropdownWidth / 2;
            const top = rect.bottom + 8;

            // clamp so it stays on screen
            const margin = 8;
            if (left < margin) left = margin;
            if (left + dropdownWidth > window.innerWidth - margin) {
                left = window.innerWidth - dropdownWidth - margin;
            }

            setDropdownPos({ top, left });
        }
    }, [open]);

    return (
        <Form method="get" className="relative inline-block text-left">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
                Filters
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className="fixed w-72 max-w-[90vw] bg-white shadow-lg border border-gray-200 rounded-lg p-4 flex flex-col gap-3 z-[9999] max-h-[80vh] overflow-y-auto"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                >
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
                        className="border rounded p-2"
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
                        className="border rounded p-2"
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <button
                        type="submit"
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        Apply
                    </button>
                </div>
            )}
        </Form>
    );
}