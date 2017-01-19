buildAndApplyBasicUI("seconds to wait between per comment edit & delete", "Delete all my comments");

var waitTimeSeconds = 2;
var redditCommentEditButtons = undefined;
var currentEditCommentIndex = 0;
var editCommentInterval = undefined;

document.getElementById("startDeleteButton").addEventListener('click', function () {
    var deleteMessage = "Nuke Reddit History\n\n" +
        "Clicking 'OK' will overwrite all your comments and delete them!\n" +
        "Are you absolutely sure?\n\n" +
        "DO NOT CLOSE THIS TAB UNTIL ALL COMMENTS ARE DELETED!";

    if (confirm(deleteMessage)) {
        safelySetWaitTime();
        scrollTillEntireUserDataIsLoaded(waitTimeSeconds + 2, startEditingComments);
    }

});

function safelySetWaitTime() {
    var waitTimeUserInput = parseInt(document.getElementById("waitTimeUserInput").value);
    if (!isNaN(waitTimeUserInput) && waitTimeUserInput >= 2) {
        waitTimeSeconds = waitTimeUserInput;
    }
}

//edit Comments
function startEditingComments() {
    redditCommentEditButtons = document.getElementsByClassName("edit-usertext");
    console.log("total comments are: ", redditCommentEditButtons.length);
    editCommentInterval = setInterval(overwriteAndDeleteComment, waitTimeSeconds * 1000);
}

function overwriteAndDeleteComment() {
    if (currentEditCommentIndex === redditCommentEditButtons.length) {
        console.log("finished editing.");
        clearInterval(editCommentInterval);
        scrollToTopOfPage();
        deleteUserHistory(waitTimeSeconds, onDeletionComplete)
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

//other helper methods

function onDeletionComplete(){
    alert("All user comments were overwritten and deleted. Thank you for using the extension.")
}

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