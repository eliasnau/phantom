import chalk from "chalk";
import { createSpinner } from "nanospinner";
import os from "os";
import readline from "readline";

const logo = `
██▓███   ██░ ██  ▄▄▄       ███▄    █ ▄▄▄█████▓ ▒█████   ███▄ ▄███▓
▓██░  ██▒▓██░ ██▒▒████▄     ██ ▀█   █ ▓  ██▒ ▓▒▒██▒  ██▒▓██▒▀█▀ ██▒
▓██░ ██▓▒▒██▀▀██░▒██  ▀█▄  ▓██  ▀█ ██▒▒ ▓██░ ▒░▒██░  ██▒▓██    ▓██░
▒██▄█▓▒ ▒░▓█ ░██ ░██▄▄▄▄██ ▓██▒  ▐▌██▒░ ▓██▓ ░ ▒██   ██░▒██    ▒██ 
▒██▒ ░  ░░▓█▒░██▓ ▓█   ▓██▒▒██░   ▓██░  ▒██▒ ░ ░ ████▓▒░▒██▒   ░██▒
▒▓▒░ ░  ░ ▒ ░░▒░▒ ▒▒   ▓▒█░░ ▒░   ▒ ▒   ▒ ░░   ░ ▒░▒░▒░ ░ ▒░   ░  ░
░▒ ░      ▒ ░▒░ ░  ▒   ▒▒ ░░ ░░   ░ ▒░    ░      ░ ▒ ▒░ ░  ░      ░
░░        ░  ░░ ░  ░   ▒      ░   ░ ░   ░      ░ ░ ░ ▒  ░      ░   
          ░  ░  ░      ░  ░         ░              ░ ░         ░   
 `;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getEnvironmentColor = (env: string) => {
  switch (env.toLowerCase()) {
    case "production":
      return chalk.bgRed.white.bold(" PRODUCTION ");
    case "staging":
      return chalk.bgYellow.black.bold(" STAGING ");
    case "development":
      return chalk.bgGreen.white.bold(" DEVELOPMENT ");
    default:
      return chalk.bgBlue.white.bold(` ${env.toUpperCase()} `);
  }
};

const formatStartTime = (startTime: Date) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return startTime.toLocaleString("en-US", {
    timeZone: timezone,
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
};

const getSystemInfo = () => {
  return {
    platform: `${os.type()} ${os.arch()}`,
    nodeVersion: process.version,
    cpuCores: os.cpus().length,
    hostname: os.hostname(),
  };
};

// Dynamic values tracking

export const displayLogo = () => {
  console.log(chalk.red(logo));
};

export const displayServerInfo = (port: number | string, startTime: Date) => {
  const sysInfo = getSystemInfo();

  const serverInfo = [
    chalk.cyan(`\n🚀 ${chalk.bold("Server Information")}`),
    chalk.yellow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
    `${chalk.green("•")} ${chalk.bold("Status:")}        ${chalk.green(
      "Running"
    )}`,
    `${chalk.green("•")} ${chalk.bold("Environment:")}   ${getEnvironmentColor(
      process.env.NODE_ENV || "development"
    )}`,
    `${chalk.green("•")} ${chalk.bold("Port:")}          ${chalk.cyan(port)}`,
    `${chalk.green("•")} ${chalk.bold("Start Time:")}    ${chalk.cyan(
      formatStartTime(startTime)
    )}`,
    "",
    chalk.cyan("💻 System Information"),
    `   ${chalk.bold("Platform:")}       ${chalk.cyan(sysInfo.platform)}`,
    `   ${chalk.bold("Memory Usage:")}   ${chalk.cyan(123)}`,
    `   ${chalk.bold("Node Version:")}   ${chalk.cyan(sysInfo.nodeVersion)}`,
    chalk.yellow("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"),
  ];

  for (const line of serverInfo) {
    console.log(line);
  }
};

export const startServer = async (port: number | string, startTime: Date) => {
  // Initial loading steps
  //   const loadingSteps = [
  //     { text: "Initializing server...", duration: 1000 },
  //     { text: "Loading configurations...", duration: 800 },
  //     { text: "Setting up routes...", duration: 600 },
  //     { text: "Finalizing setup...", duration: 500 },
  //   ];

  //   for (const step of loadingSteps) {
  //     const spinner = createSpinner(step.text).start();
  //     await sleep(step.duration);
  //     spinner.success();
  //   }

  const spinner = createSpinner("Server initialized successfully!").start();
  await sleep(500);
  spinner.success();

  displayServerInfo(port, startTime);
};

// Clean up on exit
process.on("SIGINT", () => {
  process.exit();
});
