ensureUser = function (userId) {
  if (!userId) {
    throw new Meteor.Error("not-logged-in");
  }

  return Meteor.users.findOne(userId);
};
