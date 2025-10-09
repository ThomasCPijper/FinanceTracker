import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import { commitSession, getSession } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user || user.password !== password) {
    return { error: "Onjuiste inloggegevens." };
  }

  const session = await getSession(request);
  session.set("userId", user.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 to-blue-100">
        {/* Left side image / branding */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-indigo-600 text-white p-12">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              FinanceTracker
            </h1>
            <p className="text-indigo-100 text-lg">
              Beheer je inkomsten en uitgaven eenvoudig en overzichtelijk.
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
              Inloggen
            </h1>

            <Form method="post" className="space-y-5">
              <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                  E-mail
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                  Wachtwoord
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              {actionData?.error && (
                  <p className="text-red-600 text-sm text-center font-medium">
                    {actionData.error}
                  </p>
              )}

              <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200 font-medium"
              >
                Inloggen
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                Nog geen account?{" "}
                <a
                    href="/register"
                    className="text-indigo-600 hover:underline font-medium"
                >
                  Registreer hier
                </a>
              </p>
            </Form>
          </div>
        </div>
      </div>
  );
}
