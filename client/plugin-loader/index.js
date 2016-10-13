(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var bodyTag = document.getElementsByTagName('body')[0];
    var headTag = document.getElementsByTagName('head')[0];
    var scriptTag = document.createElement('script');
    var styleTag = document.createElement('link');
    var pendingEvents = 2;
    var loadedEvent = new Event('studentDashboardLoaded');

    scriptTag.onload = function() {
      pendingEvents--;

      if(pendingEvents === 0) {
        document.dispatchEvent(loadedEvent);
      }
    };

    styleTag.onload = function() {
      pendingEvents--;

      if(pendingEvents === 0) {
        document.dispatchEvent(loadedEvent);
      }
    };

    bodyTag.appendChild(scriptTag);
    headTag.appendChild(styleTag);

    scriptTag.src = `${process.env.API_URL}/dist/js/plugin.min.js`;

    styleTag.setAttribute('rel', 'stylesheet');

    styleTag.href = `${process.env.API_URL}/dist/css/plugin.min.css`;
  });
})();
