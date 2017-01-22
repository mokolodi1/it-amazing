import vision from "@google-cloud/vision";

typeClothes = {
  "t shirt": "top",
  "pants": "bottom",
  "sock": "socks",
  "shoe": "shoes",
  "hat": "accessories"
}

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
        var arrayLength = detections.labels.length;
        var category = "unknown";
        var label = "unknown";
        for (var i = 0; i < arrayLength; i++) {
          if (typeClothes[detections.labels[i]]) {
            category = typeClothes[detections.labels[i]];
            label = detections.labels[i];
            break;
          }
        }

        Clothing.update(clothingId, {
          $set: {
            type: label,
            category: category
          }
        });
    }));
  },
});
