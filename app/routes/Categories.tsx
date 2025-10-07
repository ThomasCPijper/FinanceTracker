import CategoriesList from "~/components/Categories/CategoriesList";
import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from "@remix-run/node";
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

    const totalCategories = await prisma.category.count({
        where: { userId: userIdNumber },
    });

    return json({
        page,
        perPage,
        categories,
        totalCategories
    });
}

// ===== Action =====
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const session = await getSession(request);

    switch (intent) {
        case "create-category": {
            const userId = session.get("userId") as string;
            const currency = formData.get("currency") as string;
            const name = formData.get("name") as string;

            await prisma.category.create({ data: { userId, name } });
            break;
        }
        case "delete-category": {
            const idStr = formData.get("id") as string;
            if (!idStr) throw new Error("Geen ID meegegeven voor verwijderen");
            const id = parseInt(idStr, 10);
            await prisma.category.delete({ where: { id } });
            break;
        }
    }

    return redirect("/categories");
}

export default function CategoryDashboard() {
    const { categories, totalCategories, page, perPage } =
        useLoaderData<typeof loader>();

    return (
        <div className="h-[100vh] p-8 flex flex-col gap-6">
            <CategoriesList categories={categories} page={page} perPage={perPage} totalCategories={totalCategories}></CategoriesList>
        </div>
    );
}