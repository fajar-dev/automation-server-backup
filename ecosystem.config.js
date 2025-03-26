module.exports = {
  apps: [
    {
      name: "automation-server-backup",
      script: "./src/app.js",
      watch: true,
      instances: 1,
      autorestart: true,
      cron_restart: "0 */5 * * *",
      env: {
        NODE_ENV: "production",
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
