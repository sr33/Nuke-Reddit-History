var EDIT_BUTTON_TEXT = "edit";
var DELETE_BUTTON_TEXT = 'delete';

var PAGE_TYPE_COMMENTS = 'comments';
var PAGE_TYPE_POSTS = 'posts'

function findAnchorWithTextInside(text) {
    var self = this;
    var allAnchors = self.htmlElement.getElementsByTagName('a');
    return getFirstElementWithTextInside(text, allAnchors);
}

/**
 * @param: htmlElement - html element of the comment
 * @param: articleId - unique ID of the comment.
 **/
function Comment(htmlElement) {
  this.htmlElement = htmlElement;
  this.articleId = htmlElement.id;
  this.editButton = this.findAnchorWithTextInside(EDIT_BUTTON_TEXT);
  this.deleteButton = this.findAnchorWithTextInside(DELETE_BUTTON_TEXT);
  this.isEdited = false;
}

Comment.prototype.findAnchorWithTextInside = findAnchorWithTextInside;

Comment.prototype.deleteComment = function () {
    var self = this;
    if (this.isEdited) {
        self.deleteButton.click();
        var deleteConfirmation = self.findAnchorWithTextInside("yes");
        if (deleteConfirmation){
            deleteConfirmation.click();
        }
        else {
            console.log("No delete confirmation for comment: ", self.articleId)
        }
    }
};

Comment.prototype.overWrite = function () {
    this.editButton.click();
    var editTextBox = this.htmlElement.getElementsByTagName('textarea')[0];
    var saveButton = this.htmlElement.getElementsByClassName('save')[0];
    editTextBox.value = generateRandomPhrase();
    saveButton.click();
    this.isEdited = true;
};

function Post(htmlElement){
    this.htmlElement = htmlElement;
    this.deleteButton = this.findAnchorWithTextInside(DELETE_BUTTON_TEXT);
}

Post.prototype.findAnchorWithTextInside = findAnchorWithTextInside;

Post.prototype.deletePost = function() {
    var self = this;
    self.deleteButton.click();
        var deleteConfirmation = self.findAnchorWithTextInside("yes");
        if (deleteConfirmation) deleteConfirmation.click();
        else console.log('No Delete comfirmation for post ', self.htmlElement);
}

/**
 *  @param: isUserProfileCompatible: boolean - is user profile is compatible with this extension?
 *  @param: pageType: string - this is either a comments page or a posts page
 *  @param: nextButton: htmlElement - next button element to go to next page
 */
function UserPage() {
    this.comments = [];
    this.posts = [];

    this.pageType = document.URL.includes('posts')? PAGE_TYPE_POSTS: PAGE_TYPE_COMMENTS;
    this.nextButton = getFirstElementWithTextInside("next", document.getElementsByClassName('ListingPagination__navButton'));
    this.requestsStartTime = undefined;
    this.requestsEndTime = undefined;
    this.numberOfRequestsMade = 0;
    this.numberOfEditedComments = 0;
    this.numberOfDeletedComments = 0;
    this.progress = "0%";
    this.actionsLog = "App Entry: " + (new Date()).toString() + '\n';
    this.sort = getParameterByName('sort');
}

UserPage.prototype.init = function () {
    if (document.URL.includes('posts')) {
        this.scanAndDeletePosts();
    }
    else if (document.URL.includes('comments')) {
        this.initVueApp();
        this.overwriteAndDeleteComments();
    }
}

UserPage.prototype.initVueApp = function () {
    var self = this;
    this.addHtmlSticky("template.html");

    var statsApp = new Vue({
        el: '#statsDiv',
        data: {
            userPage: self
        },
        methods: {
            onFeedbackClick: function () {
                window.open("https://www.reddit.com/r/nukereddithistory/submit?title=Error%20Help:%20Log%20Provided&text=" + encodeURI(self.actionsLog), "_blank")
            }
        }
    });
}

UserPage.prototype.overwriteAndDeleteComments = function () {
    var userPage = this;
    userPage.scanComments();
    userPage.addToActionsLog("number of comments found- " + userPage.comments.length + " at- " + (new Date()).toString());
    if (userPage.comments.length > 0) {
        userPage.addToActionsLog("Started Editing Comments");
        userPage.overWriteAndDeleteComments();
    }
    else {
        userPage.addToActionsLog("No Comments Found at " + (new Date()).toString());
        userPage.addToActionsLog("Current Sort set at: " + getParameterByName('sort'));
        userPage.cycleSortParams("Nuke Reddit History tried it's best to overwrite & delete all comments on your profile.\n\n\n" +
        "Nuke Reddit History cannot find any more comments on your profile. \n\nIf you think this was done in error, please use the \n \"Issues? Submit Feedback\" button\n to report errors");
    }
}

UserPage.prototype.cycleSortParams = function (msg) {
    if (userPage.sort === undefined || userPage.sort === '' || userPage.sort === null || userPage.sort === 'new') {
        window.location.href = window.location.href + "&sort=hot";
    }
    else if (userPage.sort === "hot") {
        window.location.href = replaceParameter('sort', 'top')
    }
    else if (userPage.sort === "top") {
        window.location.href = replaceParameter('sort', 'controversial');
    }
    else {
        alert(msg);
    }
}

UserPage.prototype.addToActionsLog = function (text) {
  this.actionsLog += "\n" + text;
};


UserPage.prototype.secondsSpentOnRequests = function () {
    return parseInt((this.requestsEndTime - this.requestsStartTime) / 1000);
};

UserPage.prototype.calculateProgress = function () {
  this.progress = (((this.numberOfEditedComments + this.numberOfDeletedComments) / (this.comments.length * 2)) * 100) + "%";
};

UserPage.prototype.scanComments = function () {
    var commentHtmlElements = [].slice.call(document.querySelectorAll("[data-type='comment']")
    );
    var self = this;
    commentHtmlElements.forEach(function (commentHtmlElement) {
        var comment = new Comment(commentHtmlElement);
        self.comments.push(comment);
    });
};

UserPage.prototype.scanAndDeletePosts = function () {
    var self = this;
    this.scanPosts();
    this.addToActionsLog('number of posts found -> ', this.posts.length);
    if (this.posts.length > 0) {
        self.deletePosts();
    }
    else {
        self.cycleSortParams("Nuke Reddit History tried it's best to delete all posts on your profile.\n\n\n" +
        "Nuke Reddit History cannot find any more posts on your profile. \n\nIf you think this was done in error, please post feedback on /r/NukeRedditHistory")
    }
}

UserPage.prototype.scanPosts = function () {
    var self = this;
    var postElements = [].slice.call(document.getElementsByClassName('Post__info'));
    postElements.forEach(function (postElement) { self.posts.push(new Post(postElement)) });

}

UserPage.prototype.deletePosts = function () {
    var self = this;
    var deleteIndex = 0;

    function deletePostsWithDelay() {
        setTimeout(function () {
            self.posts[deleteIndex].deletePost();
            deleteIndex++;
            if (deleteIndex < self.posts.length) deletePostsWithDelay();
            else self.addToActionsLog('posts deletion is now complete');
            location.reload();
        }, 1500);
    }
    deletePostsWithDelay();
}

UserPage.prototype.overWriteAndDeleteComments = function () {
    /**
     * @function: Overwrite and Delete reddit comments
     * Rules:
     * 1) Respect API limits. 60 per minute is the limit. 25 saves + 25 deletes per minute.
     * 2) Overwrite with a one second delay.
     * 3) Delete with a one second delay
     * **/
    var self = this;
    /**
     * @function: overWriteLoopWithDelay
     * recursive overwrite function with counter overWriteIndex; instead of loop to call self with a second delay.
     * deletion carries it's own index
     * setTimeOut in a for or forEach loop will return immediately which is not intended in requirements.
     * */
    var overWriteIndex = 0;
    function overWriteLoopWithDelay(milliSeconds) {
        if (!milliSeconds) milliSeconds = 1500;
        setTimeout(function () {
            self.comments[overWriteIndex].overWrite();
            self.numberOfRequestsMade++;
            self.numberOfEditedComments++;
            self.calculateProgress();
            overWriteIndex++;
            if (overWriteIndex < self.comments.length){
                overWriteLoopWithDelay(milliSeconds);
            }
            else {
                self.addToActionsLog("All Comments have been Edited at " + (new Date()).toString());
                deleteLoopWithDelay(milliSeconds);
            }
        }, milliSeconds);
    }
    self.requestsStartTime = new Date();
    overWriteLoopWithDelay(1500);

    /**
     * @function DeleteLoopWithDelay
     * **/
    var deleteIndex = 0;
    function deleteLoopWithDelay(milliseconds) {
        if (!milliseconds) milliseconds = 1500;
        setTimeout(function () {
            self.comments[deleteIndex].deleteComment();
            self.numberOfRequestsMade++;
            deleteIndex++;
            self.numberOfDeletedComments++;
            self.calculateProgress();
            if (deleteIndex < self.comments.length){
                deleteLoopWithDelay(milliseconds);
            }
            else {
                self.requestsEndTime = new Date();
                self.addToActionsLog("All comments on this page have been overwritten and deleted");
                self.addToActionsLog("Stats unique to this page");
                self.addToActionsLog("Requests began at- " + self.requestsStartTime);
                self.addToActionsLog("Requests ended at- " + self.requestsStartTime);
                self.addToActionsLog("Total Seconds spent- " + self.secondsSpentOnRequests());
                self.addToActionsLog("Total Requests made- " + self.numberOfRequestsMade);
                setTimeout(function () {
                    location.reload();
                }, milliseconds + 2000);
            }
        }, milliseconds);
    }
};


UserPage.prototype.addHtmlSticky = function (pathToHtmlTemplate) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", chrome.extension.getURL(pathToHtmlTemplate), false);
    xmlHttp.send(null);

    var inject = document.createElement("div");
    inject.style.position = "-webkit-sticky";
    inject.style.position = "sticky";
    // You must specify a threshold with at least one of top, right, bottom, or left for sticky for it to work - MDN
    inject.style.top = "0";
    inject.innerHTML = xmlHttp.responseText;
    var profileSideBar = document.getElementsByClassName("side")[0];
    while (profileSideBar.firstChild) {
        profileSideBar.removeChild(profileSideBar.firstChild);
    }
    profileSideBar.appendChild(inject);
};




