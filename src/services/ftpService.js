const ftp = require('ftp');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { FTP_HOST, FTP_USER, FTP_PASSWORD } = require('../config');

async function backupFTPFiles(backupFolder) {
  const client = new ftp();
  const filePromises = [];

  return new Promise((resolve, reject) => {
    client.on('ready', () => {
      console.log('FTP connection ready');

      client.list((err, list) => {
        if (err) {
          logger.error('Error listing files: ' + err.message);
          client.end();
          reject(err);
          return;
        }

        list.forEach(file => {
          const localFilePath = path.join(backupFolder, file.name);

          const filePromise = new Promise((resolveFile, rejectFile) => {
            client.get(file.name, (err, stream) => {
              if (err) {
                logger.error(`Error downloading ${file.name}: ${err.message}`);
                rejectFile(err);
                return;
              }

              stream.once('close', () => {
                console.log(`Downloaded: ${file.name}`);
                resolveFile();
              });

              stream.pipe(fs.createWriteStream(localFilePath));
            });
          });

          filePromises.push(filePromise);
        });

        client.end();
        Promise.all(filePromises)
          .then(resolve)
          .catch(reject);
      });
    });

    client.connect({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      pasv: true
    });
  });
}

module.exports = { backupFTPFiles };
