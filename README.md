# Student Dashboard

## How to use

**1)**

Include the following script tag to your page:

```html
  <script src="comingSoon.js"></script>
```

**2)**

Call `window.StudentDashboard.initialize` after Student Dashboard has loaded. `studentDashboardLoaded` event will be dispatched in `document` when Student Dashboard is ready.

Example:

```javascript
  document.addEventListener('studentDashboardLoaded', function() { // Wait for Student Dashboard to be loaded
    window.StudentDashboard.initialize({
      accessToken: 'usersTmcAccessToken', // Tmc access token for authenticating the user
      userId: 'usersId', // User's id
      courseId: 'coursesId', // Course's id
      courseName: 'coursesName', // Course's name
      exerciseGroups: { // (name, date interval) pairs describing how to group exercises
        'Group 1': ['10.10.2016 01:00', '16.10.2016 23:59'], // From date, to date in format DD.MM.YYYY HH:mm (day.month.year hour:minute)
        'Group 2': ['16.10.2016 01:00', '23.10.2016 23:59']
      }
    });
  });
```
