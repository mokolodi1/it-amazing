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
  addClothing(image_id) {
    let user_id = Meteor.userId();
    ensureUser(user_id);

    let clothingId = Clothing.insert({
      user_id,
      type: "waiting",
      image_id,
    });

    // can start handling the next request
    this.unblock();

    Meteor.call("processClothing", clothingId);
  },
});
