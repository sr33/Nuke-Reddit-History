
console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\nN U K E + R E D D I T + H I S T O R Y\n\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')

var userPage = new UserPage();

// Check User Profile Compatibility before init
if (userPage.isUserProfileCompatible) userPage.init();
else alert('This format of user profile page is incompatible with Nuke Reddit History.\nPlease goto https://www.reddit.com/profile-beta-confirmation to get a newer reddit profile')
