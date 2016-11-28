# Nuke-Reddit-History
Chrome Extension to overwrite and delete reddit history.
Project name is not final.

###External Chrome Extensions dependencies?
- [reddit enhancement suite](https://chrome.google.com/webstore/detail/reddit-enhancement-suite/kbmfpngjjgdllneeigpgjifpgocmfgmb?hl=en-US) must be installed.

###Where does this extension live?
- https: //reddit.com/u/*loggedInUser*/comments/

###What this extension does?
- Adds an input box where you can specify time to wait in seconds(X) before each comment edit/delete. Remember this is a plain JS script with no async functions
- Adds a button that initiates the task of overwriting and deleting reddit user comments

###How does it work?
- Once activated, the extension keeps scrolling downwards to load all comments by *loggedInUser*. This is where res's scroll to load more comments feature is used.
- After detecting all comments have been loaded, the script performs overwrites every X seconds.
- The extensions then scrolls to the top of the page and starts deleting comments every X seconds.
