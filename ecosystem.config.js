module.exports = {
  apps: [
    {
      name: "backup-app",
      script: "./app.js",
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
