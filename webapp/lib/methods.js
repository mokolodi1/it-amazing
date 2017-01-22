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
  visitedNotification(notificationId) {
    check(notificationId, String);

    let user = MedBook.ensureUser(Meteor.userId());

    Notifications.update({
      _id: notificationId,

      // security
      user_id: user._id,
    }, {
      $set: {
        seen: true,
        visited: true,
      }
    });
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
  addOutfit(firstParts) {
    let image_ids = Clothing.find({
      _id: { $in: firstParts.clothing_ids }
    }).map(({ image_id }) => {
      return image_id;
    });

    console.log("image_ids:", image_ids);

    return Outfits.insert(_.extend(firstParts, {
      user_id: Meteor.userId(),
      image_ids,
    }));
  },
  setProfileName(fullAndPreferredName) {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.fullName": fullAndPreferredName.fullName,
        "profile.preferredName": fullAndPreferredName.preferredName,
      }
    });
  },
  addComment({ text, outfit_id, image_id }) {
    let fromUser = Meteor.user();
    let { fullName, preferredName } = fromUser.profile;

    console.log("image_id:", image_id);

    Comments.insert({
      text,
      outfit_id,
      name: fullName,
      user_id: Meteor.userId(),
      image_id,
    });

    let outfit = Outfits.findOne(outfit_id);

    if (outfit.user_id !== fromUser._id) {
      Notifications.insert({
        user_id: outfit.user_id,
        href: `/outfits/${outfit_id}`,
        content: `<b>${preferredName}</b> has commented on your outfit <b>${outfit.name}</b>`,
        icon: "comment",
      });
    }
  },
});
