import { Form } from "@remix-run/react";
import { useState } from "react";
import TransactionForm from "~/components/Transaction/TransactionForm";
import DeleteModal from "~/components/common/DeleteModal";

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
    categories: string[];
    page: number;
    perPage: number;
    totalTransactions: number;
}

export default function TransactionList({
                                            transactions,
                                            categories,
                                            page,
                                            perPage,
                                            totalTransactions,
                                        }: TransactionListProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const totalPages = Math.max(1, Math.ceil(totalTransactions / perPage));

    return (
        <div className="bg-white shadow-md rounded-xl p-4 flex flex-col h-[80%]">
            {/* header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-indigo-600">Transacties</h2>

                <div className="flex items-center gap-3">
                    <TransactionForm categories={categories} />

                    <Form method="get" className="flex items-center gap-2">
                        <input type="hidden" name="page" value="1" />
                        <div className="inline-block relative w-16">
                            <select
                                name="perPage"
                                defaultValue={perPage.toString()}
                                onChange={(e) => e.currentTarget.form?.submit()}
                                className="appearance-none w-full border border-gray-400 px-3 py-2 rounded-md bg-white focus:outline-none focus:border-gray-500 focus:ring-0"
                            >
                                {[5, 10, 20].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                ▼
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-y-auto border-t border-b border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Datum</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Categorie</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 uppercase">Bedrag</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Valuta</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Beschrijving</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-500 uppercase">Acties</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                    {transactions.length > 0 ? (
                        transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-700">{t.date}</td>
                                <td
                                    className={`px-4 py-3 text-sm font-medium ${
                                        t.type === "income" ? "text-green-700" : "text-red-700"
                                    }`}
                                >
                                    {t.type === "income" ? "Inkomen" : "Uitgave"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{t.category}</td>
                                <td className="px-4 py-3 text-sm text-right text-gray-900">€{t.amount.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{t.currency}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{t.description}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => setDeleteId(t.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Verwijderen
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                Geen transacties gevonden
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-center gap-2">
                <Form method="get" className="flex items-center gap-2">
                    <input type="hidden" name="perPage" value={perPage} />
                    <button
                        name="page"
                        value={Math.max(1, page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Vorige
                    </button>
                    <span className="px-3 py-1 border rounded">
            {page} / {totalPages}
          </span>
                    <button
                        name="page"
                        value={Math.min(totalPages, page + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Volgende
                    </button>
                </Form>
            </div>

            {deleteId !== null && (
                <DeleteModal transactionId={deleteId} onClose={() => setDeleteId(null)} />
            )}
        </div>
    );
}
