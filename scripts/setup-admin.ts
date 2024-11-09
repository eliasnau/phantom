import { db } from "../src/lib/db";
import { config } from "dotenv";
import chalk from "chalk";
import { adminService } from "../src/services/adminService";
import bcrypt from "bcryptjs";
import prompt from "prompt";
import {
  AdminInputSchema,
  MethodSchema,
  ConfirmSchema,
  UserEmailSchema,
} from "./types/@setup-admin";
import fs from "fs";
import path from "path";

config();

prompt.message = "";
prompt.delimiter = "";
prompt.colors = false;

async function getSecureInput(schema: prompt.Schema) {
  prompt.start();
  return await prompt.get(schema);
}

async function setupAdmin() {
  console.log(chalk.blue("\n🔐 Starting admin setup process...\n"));

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set in environment variables");
    }

    console.log(chalk.gray("→ Creating default roles and permissions..."));
    await adminService.createDefaultRoles();

    const superAdminRole = await db.role.findUnique({
      where: { name: "SUPER_ADMIN" },
    });

    if (!superAdminRole) {
      throw new Error("Failed to create SUPER_ADMIN role");
    }

    console.log(chalk.green("✓ Roles and permissions created successfully\n"));

    const existingAdmin = await db.user.findFirst({
      where: {
        roles: {
          some: {
            role: { name: "SUPER_ADMIN" },
          },
        },
      },
    });

    if (existingAdmin) {
      console.log(chalk.yellow("\n⚠️ Warning: A super admin already exists:"));
      console.log(`Email: ${existingAdmin.email}`);

      const proceedSchema: ConfirmSchema = {
        properties: {
          confirm: {
            description: chalk.blue("\nType 'proceed' to create another admin"),
            required: true,
            pattern: /^proceed$/,
          },
        },
      };

      const { confirm } = await getSecureInput(proceedSchema);
      if (confirm !== "proceed") {
        console.log(chalk.yellow("\nSetup cancelled."));
        process.exit(0);
      }
    }

    const methodSchema: MethodSchema = {
      properties: {
        choice: {
          description: chalk.blue(
            "\nChoose setup method:\n1. Create new admin account\n2. Grant admin rights to existing user\n\nEnter choice (1 or 2)"
          ),
          required: true,
          pattern: /^[12]$/,
          message: "Please enter 1 or 2",
        },
      },
    };

    const { choice } = await getSecureInput(methodSchema);

    if (choice === "1") {
      const adminSchema: AdminInputSchema = {
        properties: {
          email: {
            description: chalk.blue("\nEnter admin email"),
            required: true,
            format: "email" as const,
          },
          name: {
            description: chalk.blue("Enter admin name"),
            required: true,
            pattern: /^[a-zA-Z\s]{2,}$/,
            message:
              "Name must contain at least 2 letters and only alphabetic characters",
          },
          password: {
            description: chalk.blue("Enter admin password"),
            hidden: true,
            replace: "*",
            required: true,
            conform: (value: string) => {
              const hasMinLength = value.length >= 8;
              const hasUpperCase = /[A-Z]/.test(value);
              const hasLowerCase = /[a-z]/.test(value);
              const hasNumbers = /\d/.test(value);
              const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

              const strength = [
                hasMinLength,
                hasUpperCase,
                hasLowerCase,
                hasNumbers,
                hasSpecialChar,
              ].filter(Boolean).length;

              console.log(
                chalk.gray(
                  "\nPassword strength: " +
                    (strength === 5
                      ? chalk.green("Strong")
                      : strength >= 3
                      ? chalk.yellow("Medium")
                      : chalk.red("Weak"))
                )
              );

              return (
                hasMinLength &&
                hasUpperCase &&
                hasLowerCase &&
                hasNumbers &&
                hasSpecialChar
              );
            },
            message:
              "Password must be at least 8 characters and contain uppercase, lowercase, numbers, and special characters",
          },
        },
      };

      const input = await getSecureInput(adminSchema);

      const existingUser = await db.user.findUnique({
        where: { email: input.email as string },
      });

      if (existingUser) {
        console.log(chalk.red("\nThis email is already registered."));
        process.exit(1);
      }

      console.log(chalk.gray("\nNew admin account details:"));
      console.log(`Email: ${input.email}`);
      console.log(`Name: ${input.name}`);
      console.log(chalk.gray("Role: SUPER_ADMIN\n"));

      const confirmSchema: ConfirmSchema = {
        properties: {
          confirm: {
            description: chalk.blue("Type 'confirm' to create this account"),
            required: true,
            pattern: /^confirm$/,
          },
        },
      };

      const { confirm } = await getSecureInput(confirmSchema);
      if (confirm !== "confirm") {
        console.log(chalk.yellow("\nAccount creation cancelled."));
        process.exit(0);
      }

      await db.$transaction(async (tx) => {
        const hashedPassword = await bcrypt.hash(input.password as string, 10);

        const user = await tx.user.create({
          data: {
            email: input.email as string,
            password: hashedPassword,
            name: input.name as string,
            emailVerified: new Date(),
          },
        });

        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: superAdminRole.id,
          },
        });

        const userWithRoles = await tx.user.findUnique({
          where: { id: user.id },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        });

        console.log(chalk.gray("\nRole details:"));
        console.log(`Role: ${userWithRoles?.roles[0].role.name}`);
        console.log("Permissions:");
        userWithRoles?.roles[0].role.permissions.forEach((perm) => {
          console.log(chalk.gray(`- ${perm.name}`));
        });

        console.log(chalk.green("\n✅ Admin account created successfully!"));
        console.log(chalk.gray(`User ID: ${user.id}`));
        console.log(chalk.gray("\nYou can now:"));
        console.log(chalk.gray("1. Log in to the admin dashboard"));
        console.log(chalk.gray("2. Access all administrative features"));
        console.log(
          chalk.gray("\nLogin URL: ") +
            chalk.blue("http://localhost:3000/admin/login")
        );

        const setupInfo = {
          timestamp: new Date().toISOString(),
          adminEmail: user.email,
          environment: process.env.NODE_ENV,
          version: process.env.npm_package_version,
        };

        try {
          await fs.promises.writeFile(
            path.join(process.cwd(), ".admin-setup"),
            JSON.stringify(setupInfo, null, 2),
            "utf-8"
          );
          console.log(chalk.gray("\nSetup info saved to .admin-setup"));
        } catch (error) {
          console.error(
            chalk.yellow("\nWarning: Could not save setup info:"),
            error
          );
        }
      });
    } else {
      const userSchema: UserEmailSchema = {
        properties: {
          email: {
            description: chalk.blue("\nEnter existing user email"),
            required: true,
            format: "email" as const,
          },
        },
      };

      const input = await getSecureInput(userSchema);

      const user = await db.user.findUnique({
        where: { email: input.email as string },
        include: { roles: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.roles.some((r) => r.roleId === superAdminRole.id)) {
        console.log(chalk.yellow("\nThis user is already a super admin"));
        process.exit(0);
      }

      console.log(chalk.gray("\nUser details:"));
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name || "Not set"}\n`);

      const confirmSchema: ConfirmSchema = {
        properties: {
          confirm: {
            description: chalk.yellow("Type 'CONFIRM' to grant admin rights"),
            required: true,
            pattern: /^CONFIRM$/,
          },
        },
      };

      await getSecureInput(confirmSchema);

      await db.userRole.create({
        data: {
          userId: user.id,
          roleId: superAdminRole.id,
        },
      });

      console.log(chalk.green("\n✅ Super admin rights granted successfully"));

      const setupInfo = {
        timestamp: new Date().toISOString(),
        adminEmail: user.email,
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version,
        grantedAccess: true,
      };

      try {
        await fs.promises.writeFile(
          path.join(process.cwd(), ".admin-setup"),
          JSON.stringify(setupInfo, null, 2),
          "utf-8"
        );
        console.log(chalk.gray("\nSetup info saved to .admin-setup"));
      } catch (error) {
        console.error(
          chalk.yellow("\nWarning: Could not save setup info:"),
          error
        );
      }
    }
  } catch (error) {
    console.error(chalk.red("\n✖ Setup failed:"));
    console.error(error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

console.log(chalk.blue("\nInitializing admin setup..."));
setupAdmin().catch((error) => {
  console.error(chalk.red("\n✖ Setup failed:"), error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log(chalk.yellow("\n\nCleaning up..."));
  await db.$disconnect();
  console.log(chalk.yellow("Setup cancelled."));
  process.exit(0);
});
