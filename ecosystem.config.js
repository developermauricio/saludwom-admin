module.exports = {
  apps:[
    {
      name: 'saludwom-admin',
      script: './start.js',
      port: 8000,
      env:{
        HOST: 'localhost',
        PORT: 8000
      }
    },
  ]
}
