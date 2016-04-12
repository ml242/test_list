Posts = new Mongo.Collection("posts");
Users = Meteor.users;

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});


	Template.posts_list.helpers({
		posts:function(){
			return Posts.find({});
		}
	});


Template.form.events({
		"click .js-toggle-website-form":function(event){
			event.preventDefault();
			$("#website_form").toggle('fast');
		},


		"submit .js-save-product-form":function(event){

			console.log("i submitted")

			// here is an example of how to get the url out of the form:
			var brand = event.target.brand.value;
			var description = event.target.description.value;
			var model = event.target.model.value;
			
			//  put your website saving code in here!

			if (brand.length > 0 && model.length > 0 && description.length > 0 ) {
				Posts.insert({
					brand: brand,
					model: model,
					description: description,
					createdOn:new Date()
				});
				$('#error').text('')
				$("#website_form").toggle('slow');
			} else {
				$('#error').text('All fields must be filled out');
			}
			return false;// stop the form submit from reloading the page

		}
	});





//   Template.hello.helpers({
//     counter: function () {
//       return Session.get('counter');
//     }
//   });

//   Template.hello.events({
//     'click button': function () {
//       // increment the counter when button is clicked
//       Session.set('counter', Session.get('counter') + 1);
//     }
//   });
// }
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
    		createdOn:new Date()
    	});
    	 Posts.insert({
    	 	brand:"VW",
    		model:"Golf TDI", 
    		url:"http://www.vw.com", 
    		description:"Gas Mileage is terrible - way worse than advertised", 
    		createdOn:new Date()
    	});
    }

    if (!Users.findOne()) {
  		console.log("No Users yet. Creating starter data.");
  		Users.insert({	
    	  email: "matt@matt.com",
    	  userName: "ml242",
    		createdOn:new Date()
    	});
    	 Users.insert({
    	  email: "martin@martin.com",
    	  userName: "m4rt1n",
    		createdOn:new Date()
    	});
    }

  });
}
