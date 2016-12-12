/**
 * Created by sree on 12/2/16.
 */

var extensionElementsDiv = document.createElement("div");
extensionElementsDiv.id = "nuke-reddit-history-div";

var startDeletePostsButton = document.createElement("button");
startDeletePostsButton.id = "startDeletePostsButton";
startDeletePostsButton.innerText = "Delete All My Posts";

var waitTimeInputElement = document.createElement("input");
waitTimeInputElement.id = "waitTimeUserInput";
waitTimeInputElement.type = "number";
waitTimeInputElement.defaultValue = 2;
waitTimeInputElement.min = 2;
waitTimeInputElement.max = 8;

var waitTimelabel = document.createElement("small");
waitTimelabel.innerHTML = "seconds to wait between per post delete";

var karmaElement = document.getElementsByClassName("titlebox")[0];
karmaElement.insertAdjacentHTML('afterEnd', extensionElementsDiv.outerHTML);

extensionElementsDiv = document.getElementById("nuke-reddit-history-div");
extensionElementsDiv.innerHTML += waitTimeInputElement.outerHTML + "&nbsp;";
extensionElementsDiv.innerHTML += waitTimelabel.outerHTML;
extensionElementsDiv.innerHTML += startDeletePostsButton.outerHTML;
var waitTimeSeconds = 2;

document.getElementById("startDeletePostsButton").addEventListener('click', function () {
    var deleteMessage = "Nuke Reddit History\n\n" +
        "Clicking 'OK' will delete all your posts!\n" +
        "Are you absolutely sure?\n\n" +
        "DO NOT CLOSE THIS TAB UNTIL ALL POSTS ARE DELETED!";

    if (confirm(deleteMessage)) {
        safelySetWaitTime();
        scrollTillEntireUserDataIsLoaded(4, prepareForPostDeletion);
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