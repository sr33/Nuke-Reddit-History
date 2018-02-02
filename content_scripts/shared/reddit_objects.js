var EDIT_BUTTON_TEXT = "comment edit";
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
            console.log("No delete confirmation")
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
}

UserPage.prototype.secondsSpentOnRequests = function () {
    return parseInt((this.requestsEndTime - this.requestsStartTime) / 1000);
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
            overWriteIndex++;
            if (overWriteIndex < self.comments.length){
                overWriteLoopWithDelay(milliSeconds);
            }
            else {
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
            if (deleteIndex < self.comments.length){
                deleteLoopWithDelay(milliseconds);
            }
            else {
                self.requestsEndTime = new Date();
                console.log("All comments on this page have been overwritten and deleted");
                console.log("Stats unique to this page");
                console.log("Requests began at: " + self.requestsStartTime);
                console.log("Requests ended at: " + self.requestsStartTime);
                console.log("Total Seconds spent: " + self.secondsSpentOnRequests());
                console.log("Total Requests made: ", self.numberOfRequestsMade);
                setTimeout(function () {
                    location.reload();
                }, milliseconds + 2000);
            }
        }, milliseconds);
    }
};




