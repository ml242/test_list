// FlowRouter.route('/blog/:postId', {
//     name: 'blogPost',
//     action: function(params) {
//         console.log("This is my blog post:", params.postId);
//     }
// });

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