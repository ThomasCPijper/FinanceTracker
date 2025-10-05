// app/root.tsx
import type { LinksFunction } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import appStylesHref from "./tailwind.css?url";
import Navbar from "~/components/nav/NavBar";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: appStylesHref },
];

export default function App() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <Meta />
            <Links />
        </head>
        <body className="text-gray-900">
        {/* Wrapper div voor responsive layout en background */}
        <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 sm:bg-amber-500">
            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <main className="flex-1 p-6 space-y-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </body>
        </html>
    );
}
