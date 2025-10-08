import SummaryCard from "./SummaryCard";

interface DashboardSummaryProps {
    totalIncome: number;
    totalExpense: number;
}

export default function DashboardSummary({ totalIncome, totalExpense }: DashboardSummaryProps) {
    const netto = totalIncome - totalExpense;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <SummaryCard
                title="Inkomen deze maand"
                amount={totalIncome}
                bgColor="bg-green-100"
                textColor="text-green-700"
            />
            <SummaryCard
                title="Uitgaven deze maand"
                amount={totalExpense}
                bgColor="bg-red-100"
                textColor="text-red-700"
            />
            <SummaryCard
                title="Netto"
                amount={netto}
                bgColor="bg-indigo-100"
                textColor="text-indigo-700"
                highlightColor={netto >= 0 ? "text-green-900" : "text-red-900"}
            />
        </div>
    );
}
