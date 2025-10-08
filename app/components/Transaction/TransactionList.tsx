import { useState, useEffect } from "react";
import TransactionForm from "~/components/Transaction/TransactionForm";
import DeleteModal from "~/components/common/DeleteModal";
import Paginator from "~/components/common/Paginator";
import TransactionFilter from "~/components/Transaction/TransactionFilter";
import { Category } from "@prisma/client";

interface Transaction {
    id: number;
    date: string;
    type: "income" | "expense";
    category: string;
    amount: number;
    currency: string;
    description: string;
}

interface TransactionListProps {
    transactions: Transaction[];
    categories: Category[];
    page: number;
    perPage: number;
    totalTransactions: number;
    userCurrency: string;
    filters?: {
        startDate?: string;
        endDate?: string;
        category?: string;
        type?: "income" | "expense";
    };
}

export default function TransactionList({
                                            transactions,
                                            categories,
                                            page,
                                            perPage,
                                            totalTransactions,
                                            userCurrency,
                                            filters = {},
                                        }: TransactionListProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [converted, setConverted] = useState<Record<number, number>>({});
    const [loadingIds, setLoadingIds] = useState<number[]>([]);

    // Functie om API aan te roepen
    async function convertCurrency(from: string, to: string, amount: number) {
        if (from === to) return amount;
        try {
            const res = await fetch(
                `https://api.fastforex.io/convert?from=${from}&to=${to}&amount=${amount}&api_key=b6d56faad2-83ffaefa8e-t3t4t5`
            );
            const data = await res.json();
            return data?.result?.[to] ?? amount;
        } catch (e) {
            console.error("Conversion failed:", e);
            return amount;
        }
    }

    // Voer conversies uit zodra transacties veranderen
    useEffect(() => {
        async function runConversions() {
            const newConversions: Record<number, number> = {};
            const promises = transactions.map(async (t) => {
                if (t.currency !== userCurrency) {
                    setLoadingIds((prev) => [...prev, t.id]);
                    const convertedAmount = await convertCurrency(t.currency, userCurrency, t.amount);
                    newConversions[t.id] = convertedAmount;
                } else {
                    newConversions[t.id] = t.amount;
                }
            });

            await Promise.all(promises);
            setConverted(newConversions);
            setLoadingIds([]);
        }

        if (transactions.length > 0) runConversions();
    }, [transactions, userCurrency]);

    return (
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-col h-[80%]">
            {/* header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-indigo-600">Transactions</h2>

                <div className="flex items-center gap-3">
                    <TransactionFilter
                        initialStart={filters.startDate ? new Date(filters.startDate) : undefined}
                        initialEnd={filters.endDate ? new Date(filters.endDate) : undefined}
                        initialCategory={filters?.category}
                        categories={categories}
                    />

                    <TransactionForm categories={categories} />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-y-auto border-t border-b border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                    {transactions.length > 0 ? (
                        transactions.map((t) => {
                            const displayAmount = converted[t.id];
                            const isLoading = loadingIds.includes(t.id);

                            return (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-700">{t.date}</td>
                                    <td
                                        className={`px-4 py-3 text-sm font-medium ${
                                            t.type === "income" ? "text-green-700" : "text-red-700"
                                        }`}
                                    >
                                        {t.type === "income" ? "Income" : "Expense"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{t.category}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                                        {isLoading ? (
                                            <span className="text-gray-400 italic">Loading...</span>
                                        ) : (
                                            <>
                                                {displayAmount?.toFixed(2)} {userCurrency}
                                                {t.currency !== userCurrency && (
                                                    <span className="text-gray-400 text-xs ml-1">
                              ({t.amount} {t.currency})
                            </span>
                                                )}
                                            </>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{t.description}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setDeleteId(t.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                No transactions found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <Paginator page={page} perPage={perPage} totalItems={totalTransactions} />

            <DeleteModal
                isOpen={deleteId !== null}
                transactionId={deleteId || undefined}
                onClose={() => setDeleteId(null)}
            />
        </div>
    );
}
