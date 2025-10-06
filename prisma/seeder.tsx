import { PrismaClient } from "@prisma/client";
import fs from "fs";

const dbPath = "/tmp/dev.db";
const prisma = new PrismaClient();

export async function ensureDatabaseSeeded() {
    // Alleen seeden als database file nog niet bestaat
    if (!fs.existsSync(dbPath)) {
        console.log("🌱 Creating new SQLite DB at /tmp/dev.db");

        // Omdat file nog niet bestaat, Prisma kan opslaan
        await prisma.user.createMany({
            data: [
                { email: "user1@example.com", password: "1234" },
                { email: "user2@example.com", password: "1234" },
            ],
        });

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

        console.log("✅ Database seeded!");
    } else {
        console.log("✅ Database already exists, skipping seeding.");
    }
}
