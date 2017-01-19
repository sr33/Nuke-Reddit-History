/**
 * Created by sree on 12/2/16.
 */

buildAndApplyBasicUI("seconds to wait between per post delete", "Delete All My Posts");

var waitTimeSeconds = 2;

document.getElementById("startDeleteButton").addEventListener('click', function () {
    var deleteMessage = "Nuke Reddit History\n\n" +
        "Clicking 'OK' will delete all your posts!\n" +
        "Are you absolutely sure?\n\n" +
        "DO NOT CLOSE THIS TAB UNTIL ALL POSTS ARE DELETED!";

    if (confirm(deleteMessage)) {
        safelySetWaitTime();
        scrollTillEntireUserDataIsLoaded(waitTimeSeconds + 2, prepareForPostDeletion);
    }

});

function safelySetWaitTime() {
    var waitTimeUserInput = parseInt(document.getElementById("waitTimeUserInput").value);
    if (!isNaN(waitTimeUserInput) && waitTimeUserInput >= 2) {
        waitTimeSeconds = waitTimeUserInput;
    }
}

//prepare for deletion
function prepareForPostDeletion() {
    window.scrollTo(0, 0);
    deleteUserHistory(waitTimeSeconds, alertCompletionMessage);
}

function alertCompletionMessage(){
    alert("All Posts have been deleted!")
}