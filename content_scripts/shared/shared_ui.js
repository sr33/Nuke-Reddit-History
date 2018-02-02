/**
 * Created by sree on 12/16/16.
 */

function buildAndApplyBasicUI(deleteButtonText) {
    var extensionElementsDiv = document.createElement("div");
    extensionElementsDiv.id = "nuke-reddit-history-div";

    var startDeleteButton = document.createElement("button");
    startDeleteButton.id = "startDeleteButton";
    startDeleteButton.innerText = deleteButtonText;
    startDeleteButton.style = "background-color: #f48942;\n" +
        "    border: none;\n" +
        "    color: white;\n" +
        "    padding: none;\n" +
        "    text-align: center;\n" +
        "    text-decoration: none;\n" +
        "    display: inline-block;\n" +
        "    font-size: 12px;";


    var karmaElement = document.getElementsByClassName("ProfileSidebar__titleContainer")[0];
    karmaElement.insertAdjacentHTML('afterEnd', extensionElementsDiv.outerHTML);
    extensionElementsDiv = document.getElementById("nuke-reddit-history-div");
    extensionElementsDiv.innerHTML += startDeleteButton.outerHTML;
    extensionElementsDiv.innerHTML += "<hr>";
}