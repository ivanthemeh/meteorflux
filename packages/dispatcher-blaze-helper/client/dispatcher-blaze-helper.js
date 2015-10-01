var dispatcherHelper = function(event, tmpl) {
  var action = $(event.currentTarget).data('action');
  if (action) {
    event.preventDefault();
    event.stopImmediatePropagation();
    Dispatcher.dispatch({
      actionType: action,
      data: this,
      template: tmpl,
      event: event
    });
  }
};

Meteor.startup(function () {
  for (var t in Template) {
    if (Template.hasOwnProperty(t)) {
      var tmpl = Template[t];
      if (Blaze.isTemplate(tmpl)) {
        if (tmpl.viewName !== "body") {
          tmpl.events({
            'click a, click button, submit form': dispatcherHelper
          });
        }
      }
    }
  }
});
