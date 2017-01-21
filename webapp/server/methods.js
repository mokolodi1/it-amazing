import vision from "@google-cloud/vision";

Meteor.methods({
  processClothing(clothingId) {
    let user_id = Meteor.userId();
    let user = ensureUser(user_id);

    let clothingItem = Clothing.findOne({
      clothingId,

      // security
      user_id,
    });

    console.log(clothingItem.path);
  },
});
