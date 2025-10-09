// dashboard.tsx / dashboard route
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DashboardSummary from "~/components/Transaction/DashboardSummary";
import TransactionList from "~/components/Transaction/TransactionList";
import { prisma } from "~/utils/prisma.server";
import { getSession } from "~/session.server";
import {Transaction} from "@prisma/client";

// ===== Loader =====
export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    const userId = session.get("userId");
    if (!userId) {
        throw redirect("/");
    }

    const userIdNumber = Number(userId);
    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const perPage = parseInt(url.searchParams.get("perPage") || "10", 10);

    // Filters uit query
    const startDateStr = url.searchParams.get("dateStart");
    const endDateStr = url.searchParams.get("dateEnd");
    const category = url.searchParams.get("category");
    const type = url.searchParams.get("type") as "income" | "expense" | null;

    const filters: { start?: Date; end?: Date; category?: string; type?: string } = {};
    if (startDateStr) filters.start = new Date(startDateStr);
    if (endDateStr) filters.end = new Date(endDateStr);
    if (category) filters.category = category;
    if (type) filters.type = type;

    // Filter query
    const where: any = { userId: userIdNumber };
    if (filters.start) where.date = { gte: filters.start };
    if (filters.end) where.date = { ...where.date, lte: filters.end };
    if (filters.category) where.category = filters.category;
    if (filters.type) where.type = filters.type;

    const totalTransactions = await prisma.transaction.count({ where });
    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
    });

    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { id: true, primaryCurrency: true },
    });
    const userCurrency = user?.primaryCurrency || "EUR";

    // Aggregate income/expense for this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const totalIncomeAggregate = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId: userIdNumber, type: "income", date: { gte: startOfMonth, lte: endOfMonth } },
    });
    const totalExpenseAggregate = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId: userIdNumber, type: "expense", date: { gte: startOfMonth, lte: endOfMonth } },
    });

    const categories = await prisma.category.findMany({
        where: { userId: userIdNumber },
        orderBy: { name: "asc" }
    });

    return json({
        transactions: transactions,
        totalTransactions,
        totalIncome: totalIncomeAggregate._sum.amount ?? 0,
        totalExpense: totalExpenseAggregate._sum.amount ?? 0,
        page,
        perPage,
        categories,
        filters: {
            startDate: startDateStr ?? "",
            endDate: endDateStr ?? "",
            category: category ?? "",
            type: type ?? "",
        },
        userCurrency,
    });
}

// ===== Action =====
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const session = await getSession(request);

    switch (intent) {
        case "create-transaction": {
            const userId = session.get("userId") as number;
            const amount = parseFloat(formData.get("amount") as string);
            const currency = formData.get("currency") as string;
            const category = formData.get("category") as string;
            const type = formData.get("type") as string;
            const date = new Date(formData.get("date") as string);
            const description = formData.get("description") as string;

            await prisma.transaction.create({ data: { userId, amount, currency, category, type, date, description } });
            break;
        }
        case "delete-transaction": {
            const idStr = formData.get("id") as string;
            if (!idStr) throw new Error("Geen ID meegegeven voor verwijderen");
            const id = parseInt(idStr, 10);
            await prisma.transaction.delete({ where: { id } });
            break;
        }
    }

    return redirect("/dashboard");
}

// ===== Dashboard component =====
export default function Dashboard() {
    const { transactions: rawTransactions, userCurrency, categories, page, perPage, totalTransactions, totalIncome, totalExpense, filters } =
        useLoaderData<typeof loader>();

    const transactions: Transaction[] = rawTransactions.map((t) => ({
        ...t,
        type: t.type as "income" | "expense",
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
    }));

    return (
        <div className="p-8 flex flex-col gap-6">
            <DashboardSummary totalIncome={totalIncome} totalExpense={totalExpense} />
            <TransactionList
                categories={categories}
                transactions={transactions}
                page={page}
                perPage={perPage}
                totalTransactions={totalTransactions}
                filters={filters}
                userCurrency={userCurrency}
            />
        </div>
    );
}
