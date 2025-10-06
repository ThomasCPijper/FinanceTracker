import { Form } from "@remix-run/react";

interface DeleteModalProps {
    transactionId: number;
    onClose: () => void;
}

export default function DeleteModal({ transactionId, onClose }: DeleteModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4 text-red-600">Weet je het zeker?</h2>
                <p className="mb-6 text-gray-700">Deze transactie wordt permanent verwijderd.</p>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Annuleren
                    </button>

                    <Form method="post">
                        <input type="hidden" name="intent" value="delete-transaction" />
                        <input type="hidden" name="id" value={transactionId} />
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Verwijderen
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    );
}
