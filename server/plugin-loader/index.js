router = require('express').Router();

router.get('/script.js',
  (req, res, next) => {
    res.set('Content-Type', 'application/javascript');
    res.set('Cache-Control', 'no-store');

    res.render('plugin-loader', {
      scriptUrl: `${process.env.SD_API_URL}/dist/${req.revManifest['js/plugin.js'] || 'js/plugin.js'}`,
      styleUrl: `${process.env.SD_API_URL}/dist/${req.revManifest['css/plugin.css'] || 'css/plugin.css'}`
    });
  });

module.exports = router;
