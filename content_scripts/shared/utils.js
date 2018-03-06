/**
 * @function: generateRandomPhrase
 * @description: generates random phrase that can be used to overwrite comments
 * **/

function generateRandomPhrase() {
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

/**
 * @function: finds first element in an array of elements that includes text provided.
 * **/
function getFirstElementWithTextInside(text, htmlElements) {
    if (htmlElements) {
        for (var el in htmlElements) {
            var htmlElement = htmlElements[el];
            if (htmlElement.innerText && htmlElement.innerText === text) {
                return htmlElement;
            }
        }
    }
    return false;
}

/**
 * @function: getParameterByName - returns GET param value from current url if no url is provided
 * **/

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


/**
 * @function: replaceParameter - replaces url GET param value with value provided.
 * if url is not provided, current url is considered.
 * **/
function replaceParameter(paramName, paramValue, url) {
    if (!url) url = window.location.href;
    if (paramValue === null) {
        paramValue = '';
    }
    var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)');
    if (url.search(pattern) >= 0) {
        return url.replace(pattern, '$1' + paramValue + '$2');
    }
    url = url.replace(/\?$/, '');
    return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
}

