var EDIT_BUTTON_TEXT = "edit";
var DELETE_BUTTON_TEXT = 'delete';

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

Comment.prototype.findAnchorWithTextInside = function(text) {
    var self = this;
    var allAnchors = self.htmlElement.getElementsByTagName('a');
    return getFirstElementWithTextInside(text, allAnchors);
};

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
    var editTextBox = this.htmlElement.getElementsByClassName('MarkdownForm__text')[0];
    var saveButton = this.htmlElement.getElementsByClassName('MarkdownForm__submit')[0];
    editTextBox.value = generateRandomPhrase();
    saveButton.click();
    this.isEdited = true;
};

function UserPage() {
    this.comments = [];
    this.nextButton = getFirstElementWithTextInside("next", document.getElementsByClassName('ListingPagination__navButton'));
    this.requestsStartTime = undefined;
    this.requestsEndTime = undefined;
    this.numberOfRequestsMade = 0;
    this.numberOfEditedComments = 0;
    this.numberOfDeletedComments = 0;
    this.progress = "0%";
    this.actionsLog = "App Entry: " + (new Date()).toString();
    this.sort = getParameterByName('sort');
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
    // var commentHtmlElements = [].slice.call(document.getElementsByClassName('CommentListing__comment'));
    var commentHtmlElements = [].slice.call(document.getElementsByTagName('article'));
    var self = this;
    commentHtmlElements.forEach(function (commentHtmlElement) {
        var comment = new Comment(commentHtmlElement);
        self.comments.push(comment);
    });
};

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
    var profileSideBar = document.getElementsByClassName("ProfileTemplate__sidebar")[0];
    while (profileSideBar.firstChild) {
        profileSideBar.removeChild(profileSideBar.firstChild);
    }
    profileSideBar.appendChild(inject);
};



