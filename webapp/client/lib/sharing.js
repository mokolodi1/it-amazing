ShareIt.configure({
  sites: {                // nested object for extra configurations
      'facebook': {
          'appId': "959182237514901"   // use sharer.php when it's null, otherwise use share dialog
      },
      'twitter': {},
      'googleplus': {},
      'pinterest': {}
  },
  classes: "ui mini button", // string (default: 'large btn')
                        // The classes that will be placed on the sharing buttons, bootstrap by default.
  iconOnly: true,      // boolean (default: false)
                        // Don't put text on the sharing buttons
  applyColors: true,     // boolean (default: true)
                        // apply classes to inherit each social networks background color
  faSize: '',            // font awesome size
  faClass: ''       // font awesome classes like square
});
