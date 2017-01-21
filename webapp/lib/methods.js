Meteor.methods({
  viewedNotificationsList() {
    // set all the notifications for the user as "seen"

    let user = MedBook.ensureUser(Meteor.userId());

    Notifications.update({
      user_id: user._id,
      seen: false
    }, {
      $set: {
        seen: true
      }
    }, { multi: true });
  },
});
