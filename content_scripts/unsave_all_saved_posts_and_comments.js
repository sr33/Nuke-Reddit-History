/**
 * Created by sree on 12/16/16.
 */
buildAndApplyBasicUI("seconds to wait before each unsave", "Unsave all my saved posts/comments");

document.getElementById("startDeleteButton").addEventListener('click', function () {
    var deleteMessage = "Nuke Reddit History\n\n" +
        "Clicking 'OK' will unsave all your comments and posts!\n" +
        "Are you absolutely sure?\n\n" +
        "DO NOT CLOSE THIS TAB UNTIL ALL COMMENTS AND POSTS ARE UNSAVED!";

    if (confirm(deleteMessage)) {
        // safelySetWaitTime();
        scrollTillEntireUserDataIsLoaded(2 + 2, startUnsavingCommentsAndPosts);
    }

});

function startUnsavingCommentsAndPosts(){
    scrollToTopOfPage();
}