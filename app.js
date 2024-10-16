const cron = require('node-cron');
const moment = require('moment-timezone');
const ftp = require('ftp');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const winston = require('winston');
require('dotenv').config();

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASSWORD = process.env.FTP_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const TIME_ZONE = process.env.TIME_ZONE;
const LOCAL_BACKUP_PATH = process.env.LOCAL_BACKUP_PATH;

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'log/error.log' })
  ]
});

function backupFTPFiles(backupFolder) {
  const client = new ftp();

  client.on('ready', function() {
    console.log('FTP connection ready');
    
    client.list((err, list) => {
      if (err) {
        logger.error('Error listing files: ' + err.message);
        client.end();
        return;
      }

      list.forEach(file => {
        const localFilePath = path.join(backupFolder, file.name);

        client.get(file.name, (err, stream) => {
          if (err) {
            logger.error(`Error downloading ${file.name}: ${err.message}`);
            return;
          }
          
          stream.once('close', () => {
            console.log(`Downloaded: ${file.name}`);
          });
          
          stream.pipe(fs.createWriteStream(localFilePath));
        });
      });

      client.end();
    });
  });

  client.connect({
    host: FTP_HOST,
    user: FTP_USER,
    password: FTP_PASSWORD
  });
}

function backupDatabase(backupFolder) {
  const timestamp = moment().tz(TIME_ZONE).format("YYYY-MM-DD_HH-mm-ss");
  const backupFile = path.join(backupFolder, `backup-db-${timestamp}.sql`);

  const dumpCommand = `mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${backupFile}`;

  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error during database backup: ${error.message}`);
      return;
    }
    console.log(`Database backup completed: ${backupFile}`);
  });
}

function backupFTPAndMySQL() {
  const timestamp = moment().tz(TIME_ZONE).format("YYYY-MM-DD_HH-mm-ss");
  const backupFolder = path.join(LOCAL_BACKUP_PATH, `backup-${timestamp}`);

  fs.mkdirSync(backupFolder, { recursive: true });

  console.log(`Backup folder created: ${backupFolder}`);

  backupFTPFiles(backupFolder);
  backupDatabase(backupFolder);
}

cron.schedule("0 0 * * *", () => {
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
