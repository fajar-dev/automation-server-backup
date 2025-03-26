const { exec } = require('child_process');
const path = require('path');
const moment = require('moment-timezone');
const logger = require('../utils/logger');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, TIME_ZONE } = require('../config');

async function backupDatabase(backupFolder) {
  const timestamp = moment().tz(TIME_ZONE).format("YYYY-MM-DD_HH-mm-ss");
  const backupFile = path.join(backupFolder, `backup-db-${timestamp}.sql`);
  const dumpCommand = `mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${backupFile}`;

  return new Promise((resolve, reject) => {
    exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error during database backup: ${error.message}`);
        reject(error);
        return;
      }
      console.log(`Database backup completed: ${backupFile}`);
      resolve();
    });
  });
}

module.exports = { backupDatabase };
