Posts = new Mongo.Collection("posts");



if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});


	Template.posts_list.onCreated(function bodyOnCreated() {
	  Meteor.subscribe('users');
	});

	Template.posts_list.helpers({
		posts:function(){
			return Posts.find({});
		},
		userName: function() {

			var user =  Meteor.users.find({_id: this.ownerId.toString() }).fetch();

		  if (user && user.length > 0 ) {
		    return user[0].username;
		  } else {
		  	return "no data yet";
    	}
    }

	});


Template.form.events({
		"click .js-toggle-website-form":function(event){
			event.preventDefault();
			$("#website_form").toggle('fast');

			$('.js-toggle-website-form').toggle();
			$('#js-cancel-button').toggleClass('collapse');
		},

		"click #js-cancel-button":function(event){
			event.preventDefault();
			$("#website_form").toggle('fast');

			$('.js-toggle-website-form').toggle();
			$('#js-cancel-button').toggleClass('collapse');
		},

		"click #js-yes-button":function(event){
			event.preventDefault();
			$("#website_form").toggle('fast');
		},

		"submit .js-save-product-form":function(event){

			// here is an example of how to get the url out of the form:
			var brand = event.target.brand.value;
			var description = event.target.description.value;
			var model = event.target.model.value;
			var ownerId = Meteor.user()._id;
			console.log(ownerId)
			
			//  put your new brand complaint here!

			if (brand.length > 0 && model.length > 0 && description.length > 0 ) {
				Posts.insert({
					
					brand: brand,
					model: model,
					description: description,
					createdOn:new Date(),
					ownerId: ownerId

				});
				$('#error').text('')
				$("#website_form").toggle('slow');
			} else {
				$('#error').text('All fields must be filled out');
			}
			$('.js-toggle-website-form').toggle();
			$('#js-cancel-button').toggleClass('collapse');
			
			return false;// stop the form submit from reloading the page

		}
	});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    if (!Posts.findOne()){
    	console.log("No posts yet. Creating starter data.");
    	  Posts.insert({
    		brand:"Apple", 
    		model: "Apple iPhone 6s",
    		url:"http://www.apple.com", 
    		description:"These screens are made of paper.",
    		_id: "1",
    		ownerId: "2",
    		createdOn:new Date()
    	});
    	 Posts.insert({
    	 	brand:"VW",
    		model:"Golf TDI", 
    		url:"http://www.vw.com", 
    		_id: "2",
    		ownerId: "1",
    		description:"Gas Mileage is terrible - way worse than advertised", 
    		createdOn:new Date()
    	});
    }

    if (!Meteor.users.findOne()) {
  		console.log("No Users yet. Creating starter data.");
  		Meteor.users.insert({	
    	  email: "matt@matt.com",
    	  username: "ml242",
    	  _id: "1",
    		createdOn: new Date()
    	});
    	 Meteor.users.insert({
    	  email: "martin@martin.com",
    	  username: "m4rt1n",
    	  _id: "2",
    		createdOn: new Date()
    	});
    }
  });

	 Meteor.publish("users",function(){
        return Meteor.users.find();
    });

}
