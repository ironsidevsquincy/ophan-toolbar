document.addEventListener('DOMContentLoaded', function () {
    // get current tab
    chrome.tabs.query({'active': true, 'currentWindow': true},
       function(tabs){
            var iframe = document.createElement('iframe')
            iframe.setAttribute('src', 'http://dashboard.ophan.co.uk/graph/breakdown?url=' + encodeURIComponent(tabs[0].url));
            document.querySelector('body').appendChild(iframe);
       }
    );
});