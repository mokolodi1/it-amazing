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

  // instance.autorun(() => {
  //   let upload = instance.currentUpload.get();
  //
  //   if (upload) {
  //     console.log("upload:", upload);
  //     console.log("upload.progress.get():", upload.progress.get());
  //     $(".upload-progress").progress({
  //       percent: upload.progress.get()
  //     });
  //   }
  // });
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
