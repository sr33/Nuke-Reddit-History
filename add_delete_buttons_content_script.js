var extensionElementsDiv = document.createElement("div");
extensionElementsDiv.id = "nuke-reddit-history-div";

var startDeleteCommentsButton = document.createElement("button");
startDeleteCommentsButton.id = "startDeleteCommentsButton";
startDeleteCommentsButton.innerText = "Delete All My Comments";

var waitTimeInputElement = document.createElement("input");
waitTimeInputElement.id = "waitTimeUserInput";
waitTimeInputElement.type = "number";
waitTimeInputElement.defaultValue = 2;
waitTimeInputElement.min = 2;
waitTimeInputElement.max = 8;

var waitTimelabel = document.createElement("small");
waitTimelabel.innerHTML = "seconds to wait between per comment edit & delete";

var karmaElement = document.getElementsByClassName("titlebox")[0];
karmaElement.insertAdjacentHTML('afterEnd', extensionElementsDiv.outerHTML);

extensionElementsDiv = document.getElementById("nuke-reddit-history-div");
extensionElementsDiv.innerHTML += waitTimeInputElement.outerHTML + "&nbsp;";
extensionElementsDiv.innerHTML += waitTimelabel.outerHTML;
extensionElementsDiv.innerHTML += startDeleteCommentsButton.outerHTML;

var scrollInterval = undefined;

var waitTimeSeconds = 2;
var redditCommentEditButtons = undefined;
var currentEditCommentIndex = 0;
var editCommentInterval = undefined;

var redditCommentDeleteForms = undefined;
var currentDeleteCommentIndex = 0;
var deleteCommentInterval = undefined;

document.getElementById("startDeleteCommentsButton").addEventListener('click', function () {
    var deleteMessage = "***Nuke Reddit History***\n" +
        "Clicking 'OK' will overwrite all your redditCommentEditButtons and delete them!\n" +
        "Are you absolutely sure?\n" +
        "DO NOT CLOSE THIS TAB UNTIL ALL COMMENTS ARE DELETED!";

    if (confirm(deleteMessage)) {
        safelySetWaitTime();
        scrollInterval = setInterval(scrollToEndOfPageToGetAllComments, 4000);
    }

});

function safelySetWaitTime() {
    var waitTimeUserInput = parseInt(document.getElementById("waitTimeUserInput").value);
    if (!isNaN(waitTimeUserInput) && waitTimeUserInput >= 2) {
        waitTimeSeconds = waitTimeUserInput;
    }
}

//keep scrolling to EndOfPage
function scrollToEndOfPageToGetAllComments() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        clearInterval(scrollInterval);
        console.log("cleared scroll interval");
        startEditingComments();
    }
    window.scrollTo(0, document.body.scrollHeight);
}

//edit Comments
function startEditingComments() {
    redditCommentEditButtons = document.getElementsByClassName("edit-usertext");
    console.log("total comments are: ", redditCommentEditButtons.length);
    editCommentInterval = setInterval(overwriteAndDeleteComment, waitTimeSeconds * 1000);
}

function overwriteAndDeleteComment() {
    if (currentEditCommentIndex === redditCommentEditButtons.length) {
        console.log("finished Editing.");
        clearInterval(editCommentInterval);
        startDeletingComments();
    }
    else {
        var currentCommentEdit = redditCommentEditButtons[currentEditCommentIndex];
        overwriteComment(currentCommentEdit);
        //hit save
        document.getElementsByClassName("save")[currentEditCommentIndex].click();
        currentEditCommentIndex++;
    }
}

function overwriteComment(commentEdit) {
    commentEdit.click();
    var editTextBox = document.getElementsByTagName("textarea")[currentEditCommentIndex];
    editTextBox.innerText = generateRandomSentence();
}

//delete comments
function startDeletingComments() {
    window.scrollTo(0, 0);
    _.forEach( getRedditCommentDeleteButtons(), function (deleteButton) {
        deleteButton.click();
    });
    redditCommentDeleteForms = document.getElementsByClassName("toggle del-button");
    deleteCommentInterval = setInterval(deleteComment, waitTimeSeconds * 1000);
}

function deleteComment() {
    if (currentDeleteCommentIndex === redditCommentDeleteForms.length) {
        clearInterval(deleteCommentInterval);
    }
    else {
        var commentDeleteConfirmation = redditCommentDeleteForms[currentDeleteCommentIndex].getElementsByClassName("yes")[0];
        if (commentDeleteConfirmation) commentDeleteConfirmation.click();
        currentDeleteCommentIndex++;
    }
}

function getRedditCommentDeleteButtons() {
    return _.filter(document.getElementsByClassName("togglebutton"), function (toggleButton) {
        return toggleButton.getAttribute("data-event-action") === "delete"
    });
}
//other helper methods

function generateRandomSentence() {
    //thanks to http://stackoverflow.com/a/4709034
    var verbs =
        [
            ["go to", "goes to", "going to", "went to", "gone to"],
            ["look at", "looks at", "looking at", "looked at", "looked at"],
            ["choose", "chooses", "choosing", "chose", "chosen"]
        ];
    var tenses =
        [
            {name: "Present", singular: 1, plural: 0, format: "%subject %verb %complement"},
            {name: "Past", singular: 3, plural: 3, format: "%subject %verb %complement"},
            {name: "Present Continues", singular: 2, plural: 2, format: "%subject %be %verb %complement"}
        ];
    var subjects =
        [
            {name: "I", be: "am", singular: 0},
            {name: "You", be: "are", singular: 0},
            {name: "He", be: "is", singular: 1}
        ];
    var complementsForVerbs =
        [
            ["cinema", "Egypt", "home", "concert"],
            ["for a map", "them", "the stars", "the lake"],
            ["a book for reading", "a dvd for tonight"]
        ];

    Array.prototype.random = function () {
        return this[Math.floor(Math.random() * this.length)];
    };

    function generate() {
        var index = Math.floor(verbs.length * Math.random());
        var tense = tenses.random();
        var subject = subjects.random();
        var verb = verbs[index];
        var complement = complementsForVerbs[index];
        var str = tense.format;
        str = str.replace("%subject", subject.name).replace("%be", subject.be);
        str = str.replace("%verb", verb[subject.singular ? tense.singular : tense.plural]);
        str = str.replace("%complement", complement.random());
        return str;
    }

    return generate();
}