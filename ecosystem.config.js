module.exports = {
  apps:[
    {
      name: 'admin.test-aicode.com',
      script: './start.js',
      port: 8100,
      env:{
        HOST: 'localhost',
        PORT: 8100
      }
    },
  ]
}
