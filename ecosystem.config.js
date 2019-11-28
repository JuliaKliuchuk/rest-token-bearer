const path = require("path");

module.exports = {
  apps: [{
    name: "app",
    script: "npm i && DB_HOST=mysql CACHE_HOST=redis npm start",
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: [
      "node_modules",
      "logs",
      "tmp_data",
      ".git",
      "ecosystem.config.js"
    ],
    max_memory_restart: "1G"
  }]
};
