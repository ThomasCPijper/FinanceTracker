import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

// ⬇️ Server-side actie: wordt uitgevoerd bij form submit
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Simpele validatie
  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Ongeldige invoer." };
  }

  // Dummy login check (vervang dit met je eigen authenticatie)
  if (email === "56thomasp56@gmail.com" && password === "test123") {
    // Hier kun je een session aanmaken
    return redirect("/dashboard");
  }

  return { error: "Onjuiste inloggegevens." };
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
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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

