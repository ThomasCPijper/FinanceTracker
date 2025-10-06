import {Form, useNavigation} from "@remix-run/react";
import {useEffect, useState} from "react";
import {DatePicker} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TransactionFormProps {
    categories: string[];
}

export default function TransactionForm({ categories }: TransactionFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const navigation = useNavigation();

    useEffect(() => {
        if (navigation.state === "idle") {
            // na submit en redirect
            setIsOpen(false);
        }
    }, [navigation.state]);

    return (
        <>
            {/* Trigger-knop om modal te openen */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
                Transactie toevoegen
            </button>

            {/* Popup modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-indigo-600">
                                Nieuwe Transactie
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <Form method="post" className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="hidden" name="intent" value="create-transaction"/>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Bedrag"
                                    required
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                                />
                                <input
                                    type="text"
                                    name="currency"
                                    defaultValue="EUR"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    name="type"
                                    defaultValue="expense"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                                >
                                    <option value="income">Inkomen</option>
                                    <option value="expense">Uitgave</option>
                                </select>

                                <select
                                    name="category"
                                    defaultValue={categories?.[0] || ""}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                                >
                                    {categories?.length ? (
                                        categories.map((c, i) => (
                                            <option key={i} value={c}>
                                                {c}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            Geen categorieën beschikbaar
                                        </option>
                                    )}
                                </select>
                            </div>

                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-full"
                            />
                            {/* Hidden input zodat Remix de datum kan submitten */}
                            <input
                                type="hidden"
                                name="date"
                                value={selectedDate ? selectedDate.toISOString().substring(0, 10) : ""}
                            />

                            <input
                                type="text"
                                name="description"
                                placeholder="Beschrijving"
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                            />

                            {/* Footer knoppen */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                                >
                                    Annuleren
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                                >
                                    Opslaan
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
}
