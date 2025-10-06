import CategoriesList from "~/components/Categories/CategoriesList";
import {json, LoaderFunctionArgs} from "@remix-run/node";
import {prisma} from "~/utils/prisma.server";
import {useLoaderData} from "@remix-run/react";
import {getSession} from "~/session.server";

// ===== Loader =====
export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const userId = session.get("userId");

    if (!userId) {
        throw new Response("Unauthorized", { status: 401 });
    }
    const userIdNumber = Number(userId); // ✅ Heel belangrijk: convert naar number

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const perPage = parseInt(url.searchParams.get("perPage") || "10", 10);

    const categories = await prisma.category.findMany({
        where: { userId: userIdNumber },
        orderBy: { name: "asc" },
        skip: (page - 1) * perPage,
        take: perPage,
    });

    return json({
        page,
        perPage,
        categories
    });
}

export default function CategoryDashboard() {
    const { categories } =
        useLoaderData<typeof loader>();

    return (
        <div className="h-[100vh] p-8 flex flex-col gap-6">
            <CategoriesList categories={categories} ></CategoriesList>
        </div>
    );
}