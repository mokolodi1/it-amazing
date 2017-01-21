// https://github.com/aldeed/meteor-collection2#autovalue
dateCreatedAutoValue = function () {
  if (this.isInsert) {
    return new Date();
  } else if (this.isUpsert) {
    return { $setOnInsert: new Date() };
  } else {
    this.unset();  // Prevent user from supplying their own value
  }
};
dateModifiedAutoValue = function () {
  if (this.isSet) {
    return;
  }
  return new Date();
};

Images = new FilesCollection({
  collectionName: 'images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    // if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
    //   return true;
    // } else {
    //   return 'Please upload image, with size equal or less than 10MB';
    // }

    return true;
  },
  storagePath: "/tmp/images",
});

Notifications = new Meteor.Collection("notifications");
Notifications.attachSchema(new SimpleSchema({
  user_id: { type: String },

  // where to send the user if they click
  href: { type: String },

  // this can contain HTML: be careful!
  content: { type: String },

  // whether they've seen the notification in the list
  seen: { type: Boolean, defaultValue: false },

  // whether they've visited the href
  visited: { type: Boolean, defaultValue: false },

  // any valid semantic-ui icon class, excluding "icon"
  icon: { type: String, optional: true },

  date_created: { type: Date, autoValue: dateCreatedAutoValue },
}));