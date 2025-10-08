import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import {prisma} from "~/utils/prisma.server";
import {commitSession, getSession} from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user || user.password !== password) {
    return { error: "Onjuiste inloggegevens." };
  }

  // ✅ Session maken
  const session = await getSession(request);
  session.set("userId", user.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

// ⬇️ Client-side UI component
export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-6">Inloggen</h1>
          <Form method="post" className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Wachtwoord
              </label>
              <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            {actionData?.error && (
                <p className="text-red-600 text-sm">{actionData.error}</p>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Inloggen
            </button>
          </Form>
        </div>
      </div>
  );
}

