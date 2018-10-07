console.log('***** NUKE REDDIT HISTORY *****');

var userPage = new UserPage();

// Check User Profile Compatibility before init
if (userPage.isUserProfileCompatible) userPage.init();
else alert('This format of user profile page is incompatible with Nuke Reddit History.\n Please refer to the easy 2 step instruction on the extension description to switch to a compatible format. Thank you and Sorry for the inconvenience.')
