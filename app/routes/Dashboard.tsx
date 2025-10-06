import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DashboardSummary from "~/components/Transaction/DashboardSummary";
import TransactionList from "~/components/Transaction/TransactionList";
import { prisma } from "~/utils/prisma.server";
import {getSession} from "~/session.server";

// ===== Loader =====
export async function loader({ request }: LoaderFunctionArgs) {
    // ✅ Haal de session op
    const session = await getSession(request);
    const userId = session.get("userId");

    // ✅ Beveiliging: alleen ingelogde users
    if (!userId) {
        throw new Response("Unauthorized", { status: 401 });
    }

    const userIdNumber = Number(userId); // ✅ Heel belangrijk: convert naar number

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const perPage = parseInt(url.searchParams.get("perPage") || "10", 10);

    // totaal aantal transacties voor deze user
    const totalTransactions = await prisma.transaction.count({
        where: { userId: userIdNumber },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // 1e dag van de maand
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // totaal inkomsten deze maand
    const totalIncomeAggregate = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
            userId: userIdNumber,
            type: "income",
            date: { gte: startOfMonth, lte: endOfMonth },
        },
    });
    const totalIncome = totalIncomeAggregate._sum.amount ?? 0;

    // totaal uitgaven deze maand
    const totalExpenseAggregate = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
            userId: userIdNumber,
            type: "expense",
            date: { gte: startOfMonth, lte: endOfMonth },
        },
    });
    const totalExpense = totalExpenseAggregate._sum.amount ?? 0;

    // transacties ophalen voor deze user, met pagination
    const transactions = await prisma.transaction.findMany({
        where: { userId: userIdNumber },
        orderBy: { date: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
    });

    return json({
        transactions,
        totalTransactions,
        totalIncome,
        totalExpense,
        page,
        perPage,
        categories: ["Salaris", "Boodschappen", "Huur"],
    });
}

// ===== Action =====
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const session = await getSession(request);

    switch (intent) {
        case "create-transaction": {
            const userId = session.get("userId") as string;
            const amount = parseFloat(formData.get("amount") as string);
            const currency = formData.get("currency") as string;
            const category = formData.get("category") as string;
            const type = formData.get("type") as string;
            const date = new Date(formData.get("date") as string);
            const description = formData.get("description") as string;

            await prisma.transaction.create({
                data: { userId, amount, currency, category, type, date, description },
            });
            break;
        }
        case "delete-transaction": {
            const idStr = formData.get("id") as string;
            if (!idStr) throw new Error("Geen ID meegegeven voor verwijderen");

            const id = parseInt(idStr, 10);

            await prisma.transaction.delete({
                where: { id: id },
            });
            break;
        }
    }

    return redirect("/dashboard");
}

export default function Dashboard() {
    const { transactions, categories, page, perPage, totalTransactions, totalIncome, totalExpense } =
        useLoaderData<typeof loader>();

    return (
        <div className="h-[100vh] p-8 flex flex-col gap-6">
            <DashboardSummary
                totalIncome={totalIncome}
                totalExpense={totalExpense}
            />

            <TransactionList
                categories={categories}
                transactions={transactions}
                page={page}
                perPage={perPage}
                totalTransactions={totalTransactions}
            />
        </div>
    );
}