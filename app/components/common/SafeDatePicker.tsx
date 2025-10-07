import { useEffect, useState } from "react";

interface SafeDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
}

export default function SafeDatePicker({ selected, onChange }: SafeDatePickerProps) {
    const [DatePicker, setDatePicker] = useState<any>(null);

    useEffect(() => {
        import("react-datepicker").then((mod) => setDatePicker(() => mod.default));
        import("react-datepicker/dist/react-datepicker.css");
    }, []);

    const handleClear = () => onChange(null);

    const inputClass =
        "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-full";

    if (!DatePicker) {
        return (
            <div className="relative w-32">
                <input
                    type="date"
                    value={selected ? selected.toISOString().substring(0, 10) : ""}
                    onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
                    placeholder="dd/mm/yyyy"
                    className={inputClass}
                />
                {selected && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-1 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-32">
            <DatePicker
                selected={selected}
                onChange={onChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={inputClass}
            />
            {selected && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-1 flex items-center text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
