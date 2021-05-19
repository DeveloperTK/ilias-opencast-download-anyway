function findStreamLinks() {
    const $btnLinks = document.querySelectorAll("a.btn");
    console.log($btnLinks);

    for (const linkElement of $btnLinks) {
        if (linkElement.href.includes("cmd=streamVideo") && linkElement.classList.contains("btn")) {
            addDirectLinkEvent(linkElement);
        }
    }
}

function addDirectLinkEvent(e) {
    const newLink = document.createElement('a');
    newLink.classList.add('btn');
    newLink.classList.add('btn-info');
    newLink.innerHTML = `Direktlink`;
    newLink.addEventListener('click', () => {
        loadExternalPage(e, newLink);
    });
    e.parentElement.appendChild(newLink);
}

function loadExternalPage(e, newLink) {
    newLink.innerHTML = "Loading";
    let timeout = setTimeout(() => {
        newLink.innerHTML = "Timeout!"
        setTimeout(() => newLink.innerHTML = "Direktlink")
    }, 10000);

    fetch(e.href)
        .then(function(response) {
            // When the page is loaded convert it to text
            return response.text()
        })
        .then(function(html) {
            // Initialize the DOM parser
            let parser = new DOMParser();
            // Parse the text
            let targetDocument = parser.parseFromString(html, "text/html");

            clearTimeout(timeout);
            openDirectDownloadLink(e, targetDocument, newLink);
        })
        .catch(function(err) {
            console.log('Failed to fetch page: ', err);
        });
}

function openDirectDownloadLink(originalLink, targetDocument, newLink) {
    try {
        let x = targetDocument.getElementsByTagName('script')
        let script = x[x.length - 1]
        let text = script.text.replaceAll("\n", "").replaceAll("\t", "").replaceAll("xoctPaellaPlayer.init(", "[").replaceAll(")", "]")
        let link = JSON.parse(text)[0].streams[0].sources.mp4[0].src
        navigator.clipboard.writeText(link).then(function () {
            console.log('Async: Copying to clipboard was successful!');
            newLink.innerHTML = "Copied!";
            setTimeout(() => newLink.innerHTML = "Direktlink", 2500);
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
            newLink.innerHTML = "Error";
            setTimeout(() => newLink.innerHTML = "Direktlink", 2500);
        });
    } catch (err) {
        newLink.innerHTML = "Error";
        setTimeout(() => newLink.innerHTML = "Direktlink", 2500);
    }
}

const checkExist = setInterval(function() {
    if (document.querySelector('#il_center_col form').childNodes) {
        console.log("Exists!");
        clearInterval(checkExist);
        findStreamLinks();
    } else {
        console.log("does not exist");
    }
}, 100);
