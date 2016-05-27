FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "citronHome"});
  }
});

FlowRouter.route('/about', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "aboutPage"});
  }
});

FlowRouter.route('/citron/:_id', {
	name: 'citron-item',
    action: function(params) {
	    console.log("item id:", params._id);
	    BlazeLayout.render("mainLayout", {content: "citronItem"});
	    return citron = params._id
  }
});

FlowRouter.route('/users/:_id', {
  name: 'citron-user',
    action: function(params) {
      console.log("user id:", params._id);
      BlazeLayout.render("mainLayout", {content: "citronUser"});
      return thisUser = params._id
  }
});