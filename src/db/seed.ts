import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("Password123!", 10);
    await prisma.user.create({
        data: {
            email: "admin@example.com",
            password,
            name: "Admin User",
            verified: true,
            roles: {
                create: [{ role: { create: { name: "admin" } } }],
            },
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
