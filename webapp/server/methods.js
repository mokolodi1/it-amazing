import vision from "@google-cloud/vision";

Meteor.methods({
  processClothing(clothingId) {
    let user_id = Meteor.userId();
    let user = ensureUser(user_id);

    let clothingItem = Clothing.findOne({
      _id: clothingId,

      // security
      user_id,
    });

    var vision = require('@google-cloud/vision');
    var visionClient = vision({
      projectId: 'decent-rampart-156319',
      keyFilename: '/tmp/keyfile.json'
    });
    var types = [
      'labels',
      'properties'
    ];

    let image = Images.findOne(clothingItem.image_id);

    visionClient.detect(image.path, types,
        Meteor.bindEnvironment(function(err, detections, apiResponse) {
      Clothing.update(clothingId, {
        $set: {
          type: detections.labels[0]
        }
      });
    }));
  }
});
