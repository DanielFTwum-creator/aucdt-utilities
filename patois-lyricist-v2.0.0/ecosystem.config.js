module.exports = {
  apps: [
    {
      name: 'patois-lyricist',
      script: 'server.ts',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
      },
      // Logging with timestamps
      out_file: '/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois/logs/out.log',
      error_file: '/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/patois/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Combine logs for better readability
      combine_logs: true,
      // Max memory before restart (512MB)
      max_memory_restart: '512M',
      // Auto-restart on file changes in production
      watch: false,
      // Graceful shutdown timeout
      kill_timeout: 5000,
    },
  ],
};
