import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import { getSession, destroySession } from "~/session.server";

const SUPPORTED_CURRENCIES = ["EUR", "USD", "GBP", "JPY", "CAD"];

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const userId = session.get("userId");
    if (!userId) throw redirect("/");

    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { id: true, email: true, primaryCurrency: true },
    });

    if (!user) throw new Response("User not found", { status: 404 });

    return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request);
    const userId = session.get("userId");
    if (!userId) throw redirect("/login");

    const formData = await request.formData();
    const intent = formData.get("intent");

    switch (intent) {
        case "update-password": {
            const password = formData.get("password") as string;
            if (!password || password.length < 6) {
                return json({ error: "Password must be at least 6 characters long" }, { status: 400 });
            }

            await prisma.user.update({
                where: { id: Number(userId) },
                data: { password },
            });

            return json({ success: "Password updated successfully!" });
        }

        case "update-currency": {
            const primaryCurrency = formData.get("primaryCurrency") as string;
            if (!SUPPORTED_CURRENCIES.includes(primaryCurrency)) {
                return json({ error: "Invalid currency selected." }, { status: 400 });
            }

            await prisma.user.update({
                where: { id: Number(userId) },
                data: { primaryCurrency },
            });

            return json({ success: "Primary currency updated!" });
        }

        case "logout": {
            session.unset("userId");
            return redirect("/", {
                headers: { "Set-Cookie": await destroySession(session) },
            });
        }

        default:
            return json({});
    }
}

export default function Profile() {
    const { user } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    return (
        <div className="h-[100vh] p-8 flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-indigo-600">Profile</h1>

                <Form method="post">
                    <input type="hidden" name="intent" value="logout" />
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                        Log Out
                    </button>
                </Form>
            </div>

            {/* Content */}
            <div className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-8 h-full overflow-y-auto">
                {/* User Info */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="mt-1">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">User ID</p>
                            <p className="mt-1">{user.id}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Primary Currency</p>
                            <p className="mt-1 font-semibold text-indigo-600">{user.primaryCurrency || "Not set"}</p>
                        </div>
                    </div>
                </section>

                {/* Update Currency */}
                <section className="border-t pt-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Primary Currency</h2>

                    {actionData?.error && (
                        <p className="text-red-600 text-sm mb-3">{actionData.error}</p>
                    )}
                    {actionData?.success && (
                        <p className="text-green-600 text-sm mb-3">{actionData.success}</p>
                    )}

                    <Form method="post" className="max-w-sm space-y-4">
                        <input type="hidden" name="intent" value="update-currency" />

                        <select
                            name="primaryCurrency"
                            defaultValue={user.primaryCurrency || ""}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="" disabled>
                                Select currency...
                            </option>
                            {SUPPORTED_CURRENCIES.map((cur) => (
                                <option key={cur} value={cur}>
                                    {cur}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition"
                        >
                            Save Currency
                        </button>
                    </Form>
                </section>

                {/* Change Password */}
                <section className="border-t pt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>

                    <Form method="post" className="max-w-sm space-y-4">
                        <input type="hidden" name="intent" value="update-password" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition"
                        >
                            Save Password
                        </button>
                    </Form>
                </section>
            </div>
        </div>
    );
}
