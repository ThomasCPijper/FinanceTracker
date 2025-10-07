import { PrismaClient } from "@prisma/client";
import fs from "fs";

const dbPath = "./dev.db";

export async function ensureDatabaseSeeded() {
    if (fs.existsSync(dbPath)) {
        console.log("Removing existing SQLite DB at ./dev.db");
        fs.unlinkSync(dbPath);
    }

    console.log("Creating new SQLite DB at ./dev.db");

    const prisma = new PrismaClient();

    // Users
    await prisma.user.createMany({
        data: [
            { email: "user1@example.com", password: "1234" },
            { email: "user2@example.com", password: "1234" },
        ],
    });

    // Categories
    await prisma.category.createMany({
        data: [
            { userId: 1, name: "Boodschappen" },
            { userId: 1, name: "Huur" },
            { userId: 1, name: "Salaris" },
            { userId: 1, name: "Verzekering" },
            { userId: 1, name: "Overig" },
            { userId: 2, name: "Boodschappen" },
            { userId: 2, name: "Huur" },
            { userId: 2, name: "Salaris" },
            { userId: 2, name: "Verzekering" },
            { userId: 2, name: "Overig" },
        ],
    });

    console.log("Database seeded!");

    await prisma.$disconnect();
}
