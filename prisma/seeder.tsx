import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function ensureDatabaseSeeded() {
    const existingUsers = await prisma.user.count();

    if (existingUsers === 0) {
        console.log("🌱 Seeding database...");

        // Users
        await prisma.user.createMany({
            data: [
                { id: 1, email: "user1@example.com", password: "1234" },
                { id: 2, email: "user2@example.com", password: "1234" },
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

        console.log("✅ Database seeded!");
    } else {
        console.log("✅ Database already seeded, skipping.");
    }
}
