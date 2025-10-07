import {Form} from "@remix-run/react";
import Paginator from "~/components/common/Paginator";
import CategoryForm from "~/components/Categories/CategoryForm";
import {useState} from "react";
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

export default function CategoriesList({categories, page, perPage, totalCategories}: CategoriesListProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <div className="bg-white shadow-md rounded-xl p-4 relative grid grid-rows-[auto_1fr_auto] h-full max-h-screen">
            {/* header */}
            <div className="flex items-center justify-between mb-2 gap-4">
                <h2 className="text-xl font-semibold text-indigo-600">Categories</h2>

                <div className="flex items-center gap-3">
                    <CategoryForm></CategoryForm>

                    <Form method="get" className="flex items-center gap-2">
                        <input type="hidden" name="page" value="1" />
                        <div className="inline-block relative w-16">
                            <select
                                name="perPage"
                                defaultValue={perPage}
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
            <div className="min-h-0 overflow-hidden border-t border-b border-gray-200 rounded-md">
                <div className="h-full overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Name</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {categories.length > 0 ? (
                            categories.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 flex justify-between items-center text-sm text-gray-700">
                                        {t.name}
                                        <button
                                            onClick={() => setDeleteId(t.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium">
                                            Verwijderen
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                    No categories found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Paginator page={page} perPage={perPage} totalItems={totalCategories} />

            <DeleteModal
                isOpen={deleteId !== null}
                categoryId={deleteId || undefined}
                onClose={() => setDeleteId(null)}
            />
        </div>
    );
}