import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import DashboardSummary from "~/components/Transaction/DashboardSummary";
import TransactionList from "~/components/Transaction/TransactionList";
import { prisma } from "~/utils/prisma.server";

// ===== Loader =====
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const perPage = parseInt(url.searchParams.get("perPage") || "10", 10);

  const totalTransactions = await prisma.transaction.count();

  const totalIncomeAggregate = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "income" },
  });
  const totalIncome = totalIncomeAggregate._sum.amount ?? 0;

  const totalExpenseAggregate = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "expense" },
  });
  const totalExpense = totalExpenseAggregate._sum.amount ?? 0;

  const transactions = await prisma.transaction.findMany({
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

  switch (intent) {
    case "create-transaction": {
      const amount = parseFloat(formData.get("amount") as string);
      const currency = formData.get("currency") as string;
      const category = formData.get("category") as string;
      const type = formData.get("type") as string;
      const date = new Date(formData.get("date") as string);
      const description = formData.get("description") as string;

      await prisma.transaction.create({
        data: { amount, currency, category, type, date, description },
      });
      break;
    }
    case "delete-transaction": {
      const idStr = formData.get("id") as string;
      if (!idStr) throw new Error("Geen ID meegegeven voor verwijderen");

      const id = parseInt(idStr, 10);

      await prisma.transaction.delete({
        where: { id },
      });
      break;
    }
  }

  return redirect("/");
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
