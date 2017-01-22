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
  somethingSelected() {
    let selectedIds = Session.get("selectedIds");

    let keys = Object.keys(selectedIds);

    for (let i = 0; i < keys.length; i++) {
      if (selectedIds[keys[i]]) {
        return true;
      }
    }
  },
});

Template.closet.events({
  "click .create-outfit"(event, instance) {
    $("#add-outfit-modal").modal("show");
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
  },
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
  },
});

// Template.closetCard

Session.setDefault("selectedIds", {});

Template.closetCard.onRendered(function () {
  let instance = this;

  // keep the last value so it doesn't run a ton of times
  let current = false;

  instance.autorun((computation) => {
    let itemSelected = Session.get("selectedIds")[instance.data._id];

    if (itemSelected !== current) {
      let $image = instance.$('.image');

      if (itemSelected) {
        $image.dimmer({
          opacity: 0.4,
          duration: {
            show: 100,
            hide: 100,
          },
          closable: false,
        }).dimmer("show");
      } else {
        // don't need to hide if first run
        if (!computation.firstRun) {
          $image.dimmer("hide");
        }
      }
    }

    current = itemSelected;
  });
});

let colorDict = {
  top: "red",
  bottom: "blue",
  shoes: "yellow",
  socks: "green",
  accessory: "purple",
};

Template.closetCard.helpers({
  sinceCreated() {
    return moment(this.date_created).fromNow();
  },
  capitalize(thing) {
    return thing.charAt(0).toUpperCase() + thing.slice(1);
  },
  categoryColor() {
    return colorDict[this.category];
  },
});

Template.closetCard.events({
  "click .toggle-selected"(event, instance) {
    let selectedIds = Session.get("selectedIds");

    let { _id } = instance.data;
    selectedIds[_id] = !selectedIds[_id];

    Session.set("selectedIds", selectedIds);
  },
});

// Template.outfits

Template.outfits.onCreated(function () {
  let instance = this;

  instance.subscribe("outfits");
});

Template.outfits.helpers({
  getOutfits() {
    return Outfits.find({}, { sort: { date_created: -1 } });
  },
  sinceCreated() {
    return moment(this.date_created).fromNow();
  },
});

// Template.viewOutfit

Template.viewOutfit.onCreated(function () {
  let instance = this;

  instance.subscribe("outfit", FlowRouter.getParam("outfit_id"));
});

Template.viewOutfit.helpers({
  getOutfit() {
    return Outfits.findOne(FlowRouter.getParam("outfit_id"));
  },
  getClothing() {
    return Clothing.find({});
  },
  capitalize(thing) {
    return thing.charAt(0).toUpperCase() + thing.slice(1);
  },
  categoryColor() {
    return colorDict[this.category];
  },
});
