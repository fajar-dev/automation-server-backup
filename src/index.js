const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { backupFTPFiles } = require('./services/ftpService');
const { backupDatabase } = require('./services/databaseService');
const logger = require('./utils/logger');
const { TIME_ZONE, LOCAL_BACKUP_PATH } = require('./config');

async function backupFTPAndMySQL() {
  const timestamp = moment().tz(TIME_ZONE).format("YYYY-MM-DD_HH-mm-ss");
  const backupFolder = path.join(LOCAL_BACKUP_PATH, `backup-${timestamp}`);

  fs.mkdirSync(backupFolder, { recursive: true });
  console.log(`Backup folder created: ${backupFolder}`);

  try {
    await Promise.all([
      backupFTPFiles(backupFolder),
      backupDatabase(backupFolder)
    ]);
    console.log('Backup FTP dan Database selesai.');
  } catch (error) {
    logger.error(`Error during backup process: ${error.message}`);
  }
}

cron.schedule("*/5 * * * *", () => {
  console.log('Running FTP and MySQL backup...');
  backupFTPAndMySQL();
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

console.log('Backup service is running...');
