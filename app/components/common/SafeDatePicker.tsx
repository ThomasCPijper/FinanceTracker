import { useEffect, useState } from "react";

interface SafeDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
}

export default function SafeDatePicker({ selected, onChange }: SafeDatePickerProps) {
    const [DatePicker, setDatePicker] = useState<any>(null);

    useEffect(() => {
        // Dynamisch importeren — gebeurt alleen in de browser
        import("react-datepicker").then((mod) => setDatePicker(() => mod.default));
        import("react-datepicker/dist/react-datepicker.css");
    }, []);

    if (!DatePicker) {
        // Fallback terwijl de picker nog laadt
        return (
            <input
                type="date"
                value={selected ? selected.toISOString().substring(0, 10) : ""}
                onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-full"
            />
        );
    }

    return (
        <DatePicker
            selected={selected}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-full"
        />
    );
}
