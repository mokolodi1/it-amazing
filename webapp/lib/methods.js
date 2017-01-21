Meteor.methods({
  viewedNotificationsList() {
    // set all the notifications for the user as "seen"

    let user_id = Meteor.userId();
    let user = ensureUser(user_id);

    Notifications.update({
      user_id,
      seen: false
    }, {
      $set: {
        seen: true
      }
    }, { multi: true });
  },
});
