Template.closet.onCreated(function () {
  let instance = this;

  instance.subscribe("sharedClosets");

  instance.currentCloset = new ReactiveVar({
    user_id: Meteor.userId(),
    name: "Your closet",
  });

  instance.autorun(() => {
    if (Meteor.userId()) {
      instance.subscribe("allClothing", instance.currentCloset.get().user_id);
    }
  });
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
  sharingEnabled() {
    const user = Meteor.user();

    return user && user.profile &&
        user.profile.fullName &&
        user.profile.preferredName;
  },
  getClosets() {
    let others = Meteor.users.find({
      _id: { $ne: Meteor.userId() }
    }).map((user) => {
      return {
        user_id: user._id,
        name: user.profile.fullName + "'s closet",
      };
    });

    return [
      {
        user_id: Meteor.userId(),
        name: "Your closet"
      },
    ].concat(others);
  },
  currentClosetName() {
    return Template.instance().currentCloset.get().name;
  },
});

Template.closet.events({
  "click .create-outfit"(event, instance) {
    $("#add-outfit-modal").modal("show");
  },
  "click .set-closet"(event, instance) {
    instance.currentCloset.set(this);
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

  instance.imageId = new ReactiveVar();
});

Template.viewOutfit.onRendered(function () {
  this.$(".form .form-group").removeClass("form-group").addClass("field");
});

Template.viewOutfit.helpers({
  getOutfit() {
    return Outfits.findOne(FlowRouter.getParam("outfit_id"));
  },
  getClothing() {
    let outfit = Outfits.findOne(FlowRouter.getParam("outfit_id"));

    return Clothing.find({ _id: { $in: outfit.clothing_ids } });
  },
  capitalize(thing) {
    return thing.charAt(0).toUpperCase() + thing.slice(1);
  },
  categoryColor() {
    return colorDict[this.category];
  },
  currentUrl() {
    return window.location.href;
  },
  sinceCreated() {
    return moment(this.date_created).fromNow();
  },
  sharingEnabled() {
    const user = Meteor.user();

    return user && user.profile &&
        user.profile.fullName &&
        user.profile.preferredName;
  },
  commentSchema() {
    return new SimpleSchema({
      text: { type: String, label: "Enter your comment" },
      outfit_id: { type: String },
      image_id: { type: String, optional: true },
    });
  },
  getComments() {
    return Comments.find({});
  },
  getImageId() {
    return Template.instance().imageId.get();
  },
  reactiveImageId() {
    return Template.instance().imageId;
  },
  shareData() {
    console.log("this.name:", this.name);

    return {
      title: this.name,
      author: Meteor.user().profile.fullName,
      description: this.description,
    }
  },
});

Template.viewOutfit.events({
  "submit #addComment"(event, instance) {
    instance.imageId.set(null);

    instance.$(".ui.dropdown").dropdown("clear");
  },
});

// Template.askForName

Template.askForName.helpers({
  needToAskForName: function () {
    const user = Meteor.user();

    return !user || !user.profile ||
        !user.profile.fullName ||
        !user.profile.preferredName;
  },
});

// Template.askForNameForm

Template.askForNameForm.onRendered(function () {
  this.$(".form .form-group").removeClass("form-group").addClass("field");
});

Template.askForNameForm.helpers({
  nameSchema() {
    return new SimpleSchema({
      fullName: { type: String },
      preferredName: { type: String },
    });
  },
});

// Template.semanticUIDropdown

Template.semanticUIDropdown.onRendered(function () {
  this.$(".ui.dropdown").dropdown(this.data.options);
});

// Template.linkClothingButton

Template.linkClothingButton.onCreated(function () {
  this.subscribe("literallyAllClothing");
});

Template.linkClothingButton.onRendered(function () {
  let instance = this;

  instance.$(".ui.dropdown").dropdown({
    onChange(value, text, $choice) {
      instance.data.set(value);
    },
  });
});

Template.linkClothingButton.helpers({
  allClothing() {
    return Clothing.find({});
  },
  capitalize(thing) {
    return thing.charAt(0).toUpperCase() + thing.slice(1);
  },
});
