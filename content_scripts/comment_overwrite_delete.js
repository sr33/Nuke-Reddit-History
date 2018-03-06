
if (getParameterByName('efe2d409a42') === 'f9ce4f81e6326') {
    init();
}


function init() {
    var userPage = new UserPage();
    userPage.addHtmlSticky("template.html");

    var statsApp = new Vue({
        el: '#statsDiv',
        data: {
            userPage: userPage
        },
        methods: {
            onFeedbackClick: function () {
                window.open("https://www.reddit.com/r/nukereddithistory/submit?title=Error%20Help:%20Log%20Provided&text=" + encodeURI(userPage.actionsLog), "_blank")
            }
        }
    });

    userPage.scanComments();
    userPage.addToActionsLog("number of comments found- " + userPage.comments.length + " at- " + (new Date()).toString());
    if (userPage.comments.length > 0) {
        userPage.addToActionsLog("Started Editing Comments");
        userPage.overWriteAndDeleteComments();
    }
    else {
        userPage.addToActionsLog("No Comments Found at " + (new Date()).toString());
        userPage.addToActionsLog("Current Sort set at: " + getParameterByName('sort'));

        if (userPage.sort === undefined || userPage.sort === '' || userPage.sort === null){
            window.location.href = window.location.href + "&sort=hot";
        }
        else if (userPage.sort === "hot") {
            window.location.href = replaceParameter('sort', 'top')
        }
        else if (userPage.sort === "top") {
            window.location.href = replaceParameter('sort', 'controversial');
        }
        else {
            alert("Nuke Reddit History Extension tried it's best to overwrite & delete all comments on your profile.\n\n\n" +
                "Nuke Reddit History cannot find any more comments on your profile. \n\nIf you think this was done in error, please use the \n \"Issues? Submit Feedback\" button\n to report errors");
        }

    }
}
