require('dotenv').config();

module.exports = {
  FTP_HOST: process.env.FTP_HOST,
  FTP_USER: process.env.FTP_USER,
  FTP_PASSWORD: process.env.FTP_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  TIME_ZONE: process.env.TIME_ZONE,
  LOCAL_BACKUP_PATH: process.env.LOCAL_BACKUP_PATH,
};
