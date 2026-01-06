module.exports = {
  apps: [
    {
      name: 'laser-landing',
      script: 'npx',
      args: 'serve -s dist -l 3040',
      cwd: '/home/developer/projects/laser-landing',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: '200M',
    },
  ],
}
