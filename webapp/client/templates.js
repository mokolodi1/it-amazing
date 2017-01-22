Template.closet.onCreated(function () {
  let instance = this;

  instance.subscribe("allClothing");
});

Template.closet.helpers({
  getClothing() {
    return Clothing.find({}, {
      sort: { date_created: -1 }
    });
  },
  sinceCreated() {
    return moment(this.date_created).fromNow();
  },
});

// Template.addClothing

Template.addClothing.onCreated(function () {
  let instance = this;

  instance.currentUpload = new ReactiveVar(false);
});

Template.addClothing.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.addClothing.events({
  "click .choose-files"(event, instance) {
    instance.$("#fileInput").click();
  },
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        template.currentUpload.set(false);

        Meteor.call("addClothing", fileObj._id);
      });

      upload.start();
    }
  }
});
