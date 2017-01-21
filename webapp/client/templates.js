Template.closet.onCreated(function () {
  let instance = this;

  // instance.subscribe
});

Template.closet.helpers({

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
