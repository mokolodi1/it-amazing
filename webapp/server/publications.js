Meteor.publish("allClothing", function () {
  return Clothing.find({ user_id: this.userId });
});

Meteor.publish("outfit", function (outfitId) {
  let outfit = Outfits.findOne(outfitId);

  return [
    Outfits.find(outfitId),
    Clothing.find({
      _id: { $in: outfit.clothing_ids }
    }),
  ];
});
