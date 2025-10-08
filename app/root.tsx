import type { LinksFunction } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
} from "@remix-run/react";
import appStylesHref from "./tailwind.css?url";
import Navbar from "~/components/nav/NavBar";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: appStylesHref },
];

export default function App() {
    const location = useLocation();
    const isIndexPage = location.pathname === "/";

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <Meta />
            <Links />
        </head>
        <body className="text-gray-900">
        <div className="flex flex-col sm:flex-row min-h-fit sm:min-h-screen bg-gray-100">
            {!isIndexPage && <Navbar/>}
            <main className="flex-1 space-y-8 overflow-y-auto">
                <Outlet/>
            </main>
        </div>


        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
