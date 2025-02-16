import { db } from ".";
import { eq } from "drizzle-orm";
import { users } from "./schema";

export const getUserById = async (id: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    });
    return user;
};