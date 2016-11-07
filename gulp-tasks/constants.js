module.exports = {
  NODEMON_PATHS: ['./app-modules', './server', './app.js'],
  ENV_CONFIG: {
    NODE_ENV: 'development',
    TMC_AUTH_URL: 'https://tmc.mooc.fi',
    TMC_URL: 'https://hy-canary.testmycode.io',
    MONGO_URI: 'mongodb://localhost/studentDashboard'
  }
};
