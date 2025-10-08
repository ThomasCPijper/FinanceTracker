import { Form } from "@remix-run/react";
import { useState } from "react";

export default function CategoryForm() {
    const [name, setName] = useState("");

    return (
        <Form
            method="post"
            className="flex gap-2"
            onSubmit={() => setName("")} // reset value na submit
        >
            <input type="hidden" name="intent" value="create-category" />
            <input
                type="text"
                name="name"
                placeholder="New category"
                value={name} // controlled input
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
            <button
                type="submit"
                className="px-3 py-1 bg-indigo-600 text-white rounded-md"
            >
                Add
            </button>
        </Form>
    );
}
