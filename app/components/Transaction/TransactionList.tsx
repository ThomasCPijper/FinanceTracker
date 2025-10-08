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

    useEffect(() => {
        async function runConversions() {
            const newConversions: Record<number, number> = {};
            const promises = transactions.map(async (t) => {
                if (t.currency !== userCurrency) {
                    setLoadingIds((prev) => [...prev, t.id]);
                    const convertedAmount = await convertCurrency(
                        t.currency,
                        userCurrency,
                        t.amount
                    );
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
        <div className="flex flex-col gap-4 pb-24 sm:pb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl font-semibold text-indigo-600">Transactions</h2>

                <div className="flex flex-wrap gap-2 items-center">
                    <TransactionFilter
                        initialStart={
                            filters.startDate ? new Date(filters.startDate) : undefined
                        }
                        initialEnd={
                            filters.endDate ? new Date(filters.endDate) : undefined
                        }
                        initialCategory={filters?.category}
                        categories={categories}
                    />
                    <TransactionForm
                        categories={categories}
                        defaultCurrency={userCurrency}
                    />
                </div>
            </div>

            {/* Table / Cards */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto border-t border-b border-gray-200 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                Type
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                Category
                            </th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 uppercase">
                                Amount
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                Description
                            </th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {transactions.length > 0 ? (
                            transactions.map((t) => {
                                const displayAmount = converted[t.id];
                                const isLoading = loadingIds.includes(t.id);

                                return (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {new Date(t.date).toLocaleDateString("nl-NL")}
                                        </td>
                                        <td
                                            className={`px-4 py-3 text-sm font-medium ${
                                                t.type === "income"
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                                            {t.type === "income" ? "Income" : "Expense"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {t.category}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                                            {isLoading ? (
                                                <span className="text-gray-400 italic">
                            Loading...
                          </span>
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
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {t.description}
                                        </td>
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
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-gray-400"
                                >
                                    No transactions found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden flex flex-col gap-3">
                    {transactions.length > 0 ? (
                        transactions.map((t) => {
                            const displayAmount = converted[t.id];
                            const isLoading = loadingIds.includes(t.id);
                            return (
                                <div
                                    key={t.id}
                                    className="bg-white shadow rounded-lg p-4 flex flex-col gap-1"
                                >
                                    <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      {new Date(t.date).toLocaleDateString("nl-NL")}
                    </span>
                                        <span
                                            className={`font-semibold ${
                                                t.type === "income"
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                      {t.type === "income" ? "Income" : "Expense"}
                    </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Category: {t.category}</span>
                                        <span>
                      {isLoading
                          ? "Loading..."
                          : `${displayAmount?.toFixed(2)} ${userCurrency}`}
                                            {t.currency !== userCurrency && !isLoading && (
                                                <span className="text-gray-400 ml-1">
                          ({t.amount} {t.currency})
                        </span>
                                            )}
                    </span>
                                    </div>
                                    {t.description && (
                                        <div className="text-sm text-gray-700">
                                            Desc: {t.description}
                                        </div>
                                    )}
                                    <div className="pt-2 flex justify-end">
                                        <button
                                            onClick={() => setDeleteId(t.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-4 py-8 text-center text-gray-400">
                            No transactions found
                        </div>
                    )}
                </div>
            </div>

            <Paginator
                page={page}
                perPage={perPage}
                totalItems={totalTransactions}
            />

            <DeleteModal
                isOpen={deleteId !== null}
                transactionId={deleteId || undefined}
                onClose={() => setDeleteId(null)}
            />
        </div>
    );
}
