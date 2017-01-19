/**
 * Created by sree on 12/16/16.
 */

function buildAndApplyBasicUI(waitTimeLabelText, deleteButtonText) {
    var extensionElementsDiv = document.createElement("div");
    extensionElementsDiv.id = "nuke-reddit-history-div";

    var startDeleteButton = document.createElement("button");
    startDeleteButton.id = "startDeleteButton";
    startDeleteButton.innerText = deleteButtonText;

    var waitTimeInputElement = document.createElement("input");
    waitTimeInputElement.id = "waitTimeUserInput";
    waitTimeInputElement.type = "number";
    waitTimeInputElement.defaultValue = 2;
    waitTimeInputElement.min = 2;
    waitTimeInputElement.max = 8;

    var waitTimelabel = document.createElement("small");
    waitTimelabel.innerHTML = waitTimeLabelText;

    var karmaElement = document.getElementsByClassName("titlebox")[0];
    karmaElement.insertAdjacentHTML('afterEnd', extensionElementsDiv.outerHTML);

    extensionElementsDiv = document.getElementById("nuke-reddit-history-div");
    extensionElementsDiv.innerHTML += waitTimeInputElement.outerHTML + "&nbsp;";
    extensionElementsDiv.innerHTML += waitTimelabel.outerHTML;
    extensionElementsDiv.innerHTML += "<br>";
    extensionElementsDiv.innerHTML += startDeleteButton.outerHTML;
}
