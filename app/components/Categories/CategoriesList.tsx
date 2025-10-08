import { Form } from "@remix-run/react";
import Paginator from "~/components/common/Paginator";
import CategoryForm from "~/components/Categories/CategoryForm";
import { useState } from "react";
import DeleteModal from "~/components/common/DeleteModal";

interface Category {
    id: number;
    name: string;
}

interface CategoriesListProps {
    categories: Category[];
    page: number;
    perPage: number;
    totalCategories: number;
}

export default function CategoriesList({
                                           categories,
                                           page,
                                           perPage,
                                           totalCategories,
                                       }: CategoriesListProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl font-semibold text-indigo-600">Categories</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <CategoryForm />

                    <Form method="get" className="flex items-center gap-2">
                        <input type="hidden" name="page" value="1" />
                        <div className="inline-block relative w-20">
                            <select
                                name="perPage"
                                defaultValue={perPage}
                                onChange={(e) => e.currentTarget.form?.submit()}
                                className="appearance-none w-full border border-gray-300 px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                {[5, 10, 20].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>

                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                                ▼
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            {/* Table (desktop) */}
            <div className="hidden sm:block flex-1 min-h-0 overflow-y-auto border-t border-b border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                            Name
                        </th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-500 uppercase">
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-700">{cat.name}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => setDeleteId(cat.id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                                No categories found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Cards (mobile) */}
            <div className="sm:hidden flex flex-col gap-3">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
                        >
                            <span className="text-gray-800 font-medium">{cat.name}</span>
                            <button
                                onClick={() => setDeleteId(cat.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="px-4 py-8 text-center text-gray-400">
                        No categories found
                    </div>
                )}
            </div>

            {/* Paginator */}
            <Paginator page={page} perPage={perPage} totalItems={totalCategories} />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteId !== null}
                categoryId={deleteId || undefined}
                onClose={() => setDeleteId(null)}
            />
        </div>
    );
}
