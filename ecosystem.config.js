module.exports = {
  apps:[
    {
      name: 'SaludWom-Admin',
      script: './start.js',
      env:{
        HOST: 'localhost',
        PORT: 8000
      }
    },
    {
      name: 'admin-saludwom.test-aicode.com',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      env:{
        HOST: 'localhost',
        PORT: 8000
      }
    }
  ]
}
