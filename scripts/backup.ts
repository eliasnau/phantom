import { backupService } from "../src/services/backupService";
import logger from "../src/utils/logger";

async function runBackup() {
  const args = process.argv.slice(2);
  const type = args[0] as "hourly" | "daily" | "weekly" | "manual";

  // Updated to include 'manual' as valid type
  if (!["hourly", "daily", "weekly", "manual"].includes(type)) {
    console.error("Invalid backup type. Use: hourly, daily, weekly, or manual");
    process.exit(1);
  }

  try {
    logger.info(`Starting ${type} backup...`);
    const result = await backupService.createBackup(type);
    logger.info(`Backup completed successfully: ${result.filename}`);
    process.exit(0);
  } catch (error) {
    logger.error("Backup failed:", error);
    process.exit(1);
  }
}

runBackup();
