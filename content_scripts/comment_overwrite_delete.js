

if (getParameterByName('efe2d409a42') === 'f9ce4f81e6326') {
    console.log("script loaded at ", new Date());
    setTimeout(init, 2000);
}


function init() {
    console.log("started scanning at ", new Date());
    var userPage = new UserPage();
    userPage.scanComments();
    console.log("# of comments found", userPage.comments.length);
    if (userPage.comments.length > 0) {
        userPage.overWriteAndDeleteComments();
    }
    else {
        alert("No comments found!");
    }
}


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}