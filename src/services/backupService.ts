import { db } from "../lib/db";
import path from "path";
import fs from "fs";
import logger from "../utils/logger";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export class BackupService {
  private backupDir: string;
  private dbConfig: {
    host: string;
    port: string;
    database: string;
    user: string;
    password: string;
  };

  constructor() {
    this.backupDir = path.join(process.cwd(), "backups");
    this.ensureBackupDir();

    try {
      const dbUrl = new URL(process.env.DATABASE_URL || "");
      this.dbConfig = {
        host: dbUrl.hostname,
        port: dbUrl.port || "5432",
        database: dbUrl.pathname.slice(1),
        user: dbUrl.username,
        password: decodeURIComponent(dbUrl.password),
      };
    } catch (error) {
      logger.error("Invalid DATABASE_URL:", error);
      throw new Error("Invalid DATABASE_URL configuration");
    }
  }

  private ensureBackupDir() {
    fs.mkdirSync(this.backupDir, { recursive: true });
  }

  async createBackup(
    type: "hourly" | "daily" | "weekly" | "manual" = "hourly"
  ) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `db_backup_${timestamp}.sql`;
      const fullPath = path.join(this.backupDir, filename);

      // Construct pg_dump command without SSL flag (we'll use env vars instead)
      const command = `PGPASSWORD=${this.dbConfig.password} \
        PGSSLMODE=require \
        pg_dump \
        -h ${this.dbConfig.host} \
        -p ${this.dbConfig.port} \
        -U ${this.dbConfig.user} \
        -d ${this.dbConfig.database} \
        --no-owner \
        --no-acl \
        -F p \
        > ${fullPath}`;

      logger.info(`Starting backup to ${filename}`);

      // Execute pg_dump
      const { stdout, stderr } = await execAsync(command);
      if (stderr) {
        logger.warn("pg_dump warnings:", stderr);
      }

      // Verify the backup file exists and has content
      if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size === 0) {
        throw new Error("Backup file is empty or was not created");
      }

      // Get file size
      const stats = fs.statSync(fullPath);

      // Record backup in database
      await db.backup.create({
        data: {
          type,
          filename,
          path: fullPath,
          size: stats.size,
        },
      });

      logger.info(
        `Successfully created ${type} backup: ${filename} (${stats.size} bytes)`
      );
      return { success: true, filename };
    } catch (error: any) {
      logger.error("Backup creation failed:", error);
      throw new Error(`Backup failed: ${error?.message || "Unknown error"}`);
    }
  }
}

export const backupService = new BackupService();
