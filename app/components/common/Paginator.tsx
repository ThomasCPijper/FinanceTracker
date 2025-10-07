import { Form } from "@remix-run/react";

interface PaginatorProps {
    page: number;
    perPage: number;
    totalItems: number;
}

export default function Paginator({ page, perPage, totalItems }: PaginatorProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    return (
        <div className="mt-4 flex items-center justify-center gap-2">
            <Form method="get" className="flex items-center gap-2">
                <input type="hidden" name="perPage" value={perPage} />
                <button
                    name="page"
                    value={Math.max(1, page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
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
                    Next
                </button>
            </Form>
        </div>
    );
}
