router = require('express').Router();

router.get('/script.js',
  (req, res, next) => {
    res.set('Content-Type', 'application/javascript');
    res.set('Cache-Control', 'no-store');

    let scriptPath = 'js/plugin.js';
    let stylePath = 'css/plugin.css';

    if(process.env.NODE_ENV !== 'development') {
      scriptPath = req.revManifest['js/plugin.js'] || scriptPath;
      stylePath = req.revManifest['css/plugin.css'] || stylePath;
    }

    res.render('plugin-loader', {
      scriptUrl: `${process.env.SD_API_URL}/dist/${scriptPath}`,
      styleUrl: `${process.env.SD_API_URL}/dist/${stylePath}`
    });
  });

module.exports = router;
