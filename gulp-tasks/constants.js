module.exports = {
  NODEMON_PATHS: ['./app-modules', './server', './app.js'],
  SERVER_ENV_CONFIG: {
    NODE_ENV: 'development',
    TMC_AUTH_URL: 'https://tmc.mooc.fi',
    TMC_URL: 'https://hy-canary.testmycode.io',
    MONGO_URI: 'mongodb://localhost/studentDashboard'
  },
  DEV_API_URL: 'http://localhost:3000',
  PROD_API_URL: 'https://rage-student-dashboard.herokuapp.com'
};
