module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './',
      script: 'npm',
      args: ['start'],
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env: {
        COMMON_VARIABLE: 'true',
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    development: {
      key: '~/.ssh/{key path}',
      user: '{root user}',
      host: '{host address}',
      ref: 'origin/develop',
      repo: '{git repo}',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no', 'ForwardAgent=yes'],
      path: '{install path}',
      'pre-setup' : 'scripts/pre-setup.sh',
      'post-deploy': 'npm i --production;pm2 startOrReload ecosystem.config.js development',
      env: {
        COMMON_VARIABLE: 'true',
        NODE_ENV: 'development'
      }
    },
    production: {
      key: '~/.ssh/{key path}',
      user: '{root user}',
      host: '{host address}',
      ref: 'origin/{branch}',
      repo: '{git repo}',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no', 'ForwardAgent=yes'],
      path: '{install path}',
      'pre-setup' : 'scripts/pre-setup.sh',
      'post-deploy': 'npm i --production;pm2 startOrReload ecosystem.config.js production',
      env: {
        COMMON_VARIABLE: 'true',
        NODE_ENV: 'production'
      }
    }
  }
}
