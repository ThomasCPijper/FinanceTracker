interface DashboardSummaryProps {
    totalIncome: number;
    totalExpense: number;
}

export default function DashboardSummary({ totalIncome, totalExpense }: DashboardSummaryProps) {
    const netto = totalIncome - totalExpense;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[20%]">
            {/* Income */}
            <div className="bg-green-100 rounded-xl p-6 shadow flex flex-col items-center overflow-hidden">
                <h3 className="text-lg font-semibold text-green-700">Inkomen deze maand</h3>
                <p className="text-2xl font-bold text-green-900">€{totalIncome.toFixed(2)}</p>
            </div>

            {/* Expense */}
            <div className="bg-red-100 rounded-xl p-6 shadow flex flex-col items-center overflow-hidden">
                <h3 className="text-lg font-semibold text-red-700">Uitgaven deze maand</h3>
                <p className="text-2xl font-bold text-red-900">€{totalExpense.toFixed(2)}</p>
            </div>

            {/* Net */}
            <div className="bg-indigo-100 rounded-xl p-6 shadow flex flex-col items-center overflow-hidden">
                <h3 className="text-lg font-semibold text-indigo-700">Netto</h3>
                <p className={`text-2xl font-bold ${netto >= 0 ? "text-green-900" : "text-red-900"}`}>
                    €{netto.toFixed(2)}
                </p>
            </div>
        </div>
    );
}
