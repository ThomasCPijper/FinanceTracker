interface SummaryCardProps {
    title: string;
    amount: number;
    bgColor: string;
    textColor: string;
    highlightColor?: string; // optioneel voor netto
}

export default function SummaryCard({ title, amount, bgColor, textColor, highlightColor }: SummaryCardProps) {
    return (
        <div className={`${bgColor} rounded-xl p-6 shadow flex flex-col items-center overflow-hidden`}>
            <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
            <p className={`text-2xl font-bold ${highlightColor || textColor}`}>€{amount.toFixed(2)}</p>
        </div>
    );
}
