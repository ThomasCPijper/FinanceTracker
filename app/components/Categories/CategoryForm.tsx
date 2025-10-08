import { Form } from "@remix-run/react";
import { useState } from "react";

export default function CategoryForm() {
    const [name, setName] = useState("");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // Prevent empty submission
        if (!name.trim()) {
            e.preventDefault();
            return;
        }

        // Reset after submit
        setName("");
    }

    return (
        <Form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
        >
            <input type="hidden" name="intent" value="create-category" />

            <input
                type="text"
                name="name"
                placeholder="New category"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-sm"
            />

            <button
                type="submit"
                disabled={!name.trim()}
                className={`px-4 py-2 rounded-md text-white text-sm transition ${
                    name.trim()
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-300 cursor-not-allowed"
                }`}
            >
                Add
            </button>
        </Form>
    );
}
