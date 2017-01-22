Tracker.autorun(() => {
  let routeName = FlowRouter.getRouteName();
  console.log(routeName);
  if (routeName === "home") {
    $('body').css('background-image', 'url(background.jpg)');
  }
  else {
    $('body').css('background-image', '');
  }
});

// Template.addOutfitModal

Session.setDefault("addingOutfit", false);

Template.addOutfitModal.helpers({
  nameAndDescription() {
    return new SimpleSchema({
      name: { type: String },
      description: { type: String, optional: true },
    });
  },
});

Template.addOutfitModal.onRendered(function () {
  $("#add-outfit-modal").modal({
    onApprove(first, second, third) {
      let valid = AutoForm.validateForm("addOutfit");

      if (valid) {
        Session.set("addingOutfit", true);

        let { name, description } =
            AutoForm.getFormValues("addOutfit").insertDoc;

        Meteor.call("addOutfit", {
          name,
          description,
          clothing_ids: Object.keys(Session.get("selectedIds")),
        }, (error, outfit_id) => {
          // go, go, go
          FlowRouter.go("viewOutfit", { outfit_id });

          // reset everything
          AutoForm.resetForm("addOutfit");
          Session.set("selectedIds", {});
        });
      }

      return false;
    },
  });
});
