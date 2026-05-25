// TUC RMS Backend — PM2 Ecosystem Configuration
// Usage: pm2 start ecosystem.config.js
// Docs: https://pm2.keymetrics.io/docs/usage/ecosystem-file/

module.exports = {
  apps: [
    {
      name: 'tuc-rms-api',
      script: './server-production.js',
      cwd: './backend',
      
      // Instances & Process Management
      instances: 2,                          // Run 2 instances (or 'max' for CPU count)
      exec_mode: 'cluster',                  // Use cluster mode for load balancing
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // Restart & Watch
      autorestart: true,
      watch: false,                          // Don't watch in production
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',            // Restart if >500MB memory used
      
      // Logging
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Shutdown & Timeouts
      wait_ready: true,
      kill_timeout: 30000,                   // Wait 30s before SIGKILL
      listen_timeout: 10000,
      
      // Monitoring & Alerts
      max_restarts: 5,
      min_uptime: '1m'
    }
  ],

  // Deploy configuration (optional, for automated deployments)
  deploy: {
    production: {
      user: 'root',
      host: '66.226.72.199',
      ref: 'origin/main',
      repo: 'git@github.com:aucdt-utilities/tuc-rms.git',
      path: '/var/www/tuc-rms',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
