Posts = new Mongo.Collection("posts");
	
CitronIndex = new EasySearch.Index({	
  collection: Posts,
  fields: ['description', 'brand', 'model', "category"],
  engine: new EasySearch.Minimongo()
});

var urlHome = Meteor.absoluteUrl();
var appId = function(){
			if (urlHome == 'http://localhost:3000/') {
				return 248093175573193
			} else {
				return 272905756403083
			}
	}




if (Meteor.isClient) {


	if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
	};

	Tracker.autorun(function(){
		if(!Accounts.userId()) {
			if (window.location.pathname != "/about" || '/'){
				FlowRouter.go('/')
			}
		}
	});

  ShareIt.configure({


    sites: {                // nested object for extra configurations
        'facebook': { 
        	"appId": appId()
        	// "app_id": appId()
        },
        'twitter': {},
        'pinterist': false,
    },
    iconOnly: true,      // boolean (default: false)          
    faSize: 'large',            // font awesome size
    faClass: 'square',       // font awesome classes like square,
	  classes: "large btn larg-btn", // string (default: 'large btn')
	  iconOnly: true,       // boolean (default: false)
	  applyColors: false     // boolean (default: true)
  });



	// Template.mainLayout.helpers({
	// 	fbId: function(){
	// 		return appId();
	// 	}
	// });

	// On Client
	Template.searchBox.helpers({
	  citronIndex: function(){
	  	return CitronIndex;
	  },
	  inputAttributes: function () {
      return { 'class': 'search-input', 'placeholder': 'Start searching...' };
    }
	});

	Template.citronHome.events({
  	// Modals

  	'click .show-details'() {
  		var that = this;
    	Modal.show('userDetailsModal', function(){
        return Meteor.users.findOne(that.ownerId);
    	});
  	},

  	'click .js-user-add-report'() {
  		var that = this;
    	Modal.show('addReportModal', function(){
        return Posts.findOne(that._id);
  		});
  	},

  	// javascript links

		'click .js-learnMoreItem'() {
  		var that = this;
      FlowRouter.go('/citron/' + that._id);
  	}

	});

	Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes', 'email', 'public_profile'],
    github: ['user', 'repo']
  },
  requestOfflineToken: {
    google: true
  },
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});


	Template.posts_list.onCreated(function bodyOnCreated() {
	  Meteor.subscribe('users');
	});

	Template.posts_list.events({
		"click #editPost": function(){
			Modal.show('editPostModal', this._id);
			autosize($('input[type=textarea]'));
		},
	'click #js-list-reporting-users'() {
  		Modal.show('listReportingUsers', this._id);
  	}
	});

Template.posts_list.helpers({
	posts:function(){
		return Posts.find({}, {sort: {createdOn: -1}});
	},
	userName: function() {
		var user =  Meteor.users.find({_id: this.ownerId.toString() }).fetch();
	  if (user && user.length > 0 ) {
	    return user[0].username;
	  } else {
	  	return "no data yet";
  	}
  },
  isEditable: function(){
  	return this.ownerId === Meteor.user()._id ? true : false;
  },
  witnessCountGreaterThanZero: function(){
  	return this.witnessCount > 0 ? true : false;
  },
  // shareData: function() {
  	
  //   return { 
  //   	title: this.description,
  //   	description: this.description,
  //   	author: Meteor.user().username || Meteor.user().profile.name,
  //   	// url: "https://localhost:3000"
  //   	// redirect_uri: " https://www.facebook.com/connect/login_success.html"
		// }
  // }
});

Template.userDetailsModal.helpers({
	thisUser: function(id){
		return user = Meteor.users.find({_id: id}).fetch()[0].username;
	},
	theirActions: function(id) {
		return theirActions = Posts.find({ownerId: id}).fetch();
	}
});

Template.listReportingUsers.helpers({
	reports: function(id){
		var witnessesIds = Posts.find({_id: this[0]}).fetch()[0].witnesses;
		users = []
		witnessesIds.forEach(function(id){
  		user = Meteor.users.findOne(id.witnessId)
			users.push(user)
		})
		return users
	}
});

Template.listReportingUsers.events({
	"click a.js-user-link":function(event){
		// Modal.hide();
	}
})


Template.addReportModal.helpers({	
	productInfo: function(id){	
		return product = Posts.find({_id: this._id}).fetch();
	}
});

Template.addReportModal.events({
	"submit .js-add-report-form":function(event){
			
			//  put your new brand witness here!
			event.preventDefault();

				var terms = $('.add-report-affirmative').is(':checked');
				var checked = $('.add-report-lawsuit').is(':checked');
				var wc = this.witnessCount;

				if ( Meteor.user() !== null ) {
	
					if (!terms) {
						$('#formError').text('You must agree to the terms');
						return false;
					} else {

							// https://docs.mongodb.com/v3.0/tutorial/query-documents/#specify-multiple-criteria-for-array-elements

								if ( Posts.find({ _id: this._id, 'witnesses.witnessId': Meteor.user()._id }).fetch().length < 1 ){
										Posts.update({_id: this._id}, { $set: {witnessCount: wc + 1}})
										Posts.update({_id: this._id}, { $push: { witnesses: 
												{	
													createdOn: new Date(),
													witnessId: Meteor.userId(),
													contactMe: checked
												}
											}
										});

								} else {
									
									$('#formError').text('We got you already, brosef!');

									setTimeout(function(){
										Modal.hide()
									}, 2000)

									return false;

								}


					}
				
				} else {

					$('#formError').text('You must login to bear witness');
					return false;

				}

				Modal.hide();

				return false;// stop the form submit from reloading the page
		}
})

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
			var category = event.target.category.value;
			debugger;
			console.log(ownerId)
			
			//  put your new brand complaint here!

			if (brand.length > 0 && model.length > 0 && description.length > 0 && category.length > 0) {
			
				Posts.insert({
					category: category,
					brand: brand,
					model: model,
					description: description,
					createdOn:new Date(),
					witnessCount: 0,
					ownerId: ownerId
				});
			
				$('#error').text('')
				$("#website_form").toggle('slow');
				$('.js-toggle-website-form').toggle();
				$('#js-cancel-button').toggleClass('collapse');
			} else {
				$('#error').text('All fields must be filled out');
			}

			
			return false;// stop the form submit from reloading the page
		}

	});

	Template.cta.events({
			"click .js-learnMore":function(event){
				event.preventDefault();
				FlowRouter.go("/about");
			}
	});


	Template.citronItem.helpers({
		itemOwner:function(id){
			return user = Meteor.users.find(id).fetch();
		},
		citron:function(){
			return Posts.findOne({_id: citron});
		},
	});

	Template.citronUser.helpers({
		user: function(){
			return Meteor.users.findOne(thisUser);
		}
	});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    Posts.remove({});

    if (!Posts.findOne()){
    	console.log("No posts yet. Creating starter data.");
    	  Posts.insert({
    		brand:"Apple", 
    		model: "Apple iPhone 6s",
    		category: "electronics",
    		url:"http://www.apple.com", 
    		description:"These screens are made of paper.",
    		_id: "1",
    		ownerId: "2",
    		createdOn:new Date(),
    		witnesses: [],
    		witnessCount: 0

    	});
    	 Posts.insert({
    	 	brand:"VW",
    		model:"Golf TDI", 
    		category: "automotive",
    		url:"http://www.vw.com", 
    		_id: "2",
    		ownerId: "1",
    		description:"Gas Mileage is terrible - way worse than advertised", 
    		createdOn:new Date(),
    		witnesses: [],
    		witnessCount: 0
    	});
    	 Posts.insert({
    	 	brand:"Honda",
    		model:"Odyssey", 
    		category: "automotive",
    		url:"http://www.honda.com", 
    		_id: "3",
    		ownerId: "2",
    		description:"This intelligent car is dumb!!!!", 
    		createdOn:new Date(),
    		witnesses: [],
    		witnessCount: 0
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
    	  username: "martin",
    	  _id: "2",
    		createdOn: new Date()
    	});
    }
  });

	 Meteor.publish("users",function(){
        return Meteor.users.find();
    });

}
