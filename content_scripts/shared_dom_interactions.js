/**
 * Created by sree on 12/6/16.
 */

function scrollTillEntireUserDataIsLoaded(intervalTimeInSec, callback) {
    var scrollInterval = setInterval(function () {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            clearInterval(scrollInterval);
            window.scrollTo(0, 0);
            callback();
        }
        scrollToTopOfPage();
    }, intervalTimeInSec * 1000);

}

function deleteUserHistory(intervalTimeInSec, callback) {
    //click all delete buttons on page
    _.forEach(getDeleteButtonsOnPage(), function (deleteButton) {
        deleteButton.click();
    });

    //Deal with yes/no confirmations
    var redditDeleteForms = document.getElementsByClassName("toggle del-button");
    var currentDeleteFormIndex = 0;
    var deleteHistoryInterval = setInterval(function () {
        if (currentDeleteFormIndex === redditDeleteForms.length) {
            clearInterval(deleteHistoryInterval);
            callback();
        } else {
            var commentDeleteConfirmation = redditDeleteForms[currentDeleteFormIndex].getElementsByClassName("yes")[0];
            if (commentDeleteConfirmation) commentDeleteConfirmation.click();
            currentDeleteFormIndex++;
        }
    }, intervalTimeInSec * 1000);
}


function getDeleteButtonsOnPage() {
    return _.filter(document.getElementsByClassName("togglebutton"), function (toggleButton) {
        return toggleButton.getAttribute("data-event-action") === "delete"
    });
}

function scrollToTopOfPage(){
    window.scrollTo(0, document.body.scrollHeight);
}