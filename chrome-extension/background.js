// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.match(/^https?:\/\/(?:www|m)\.guardian(?:news)?\.co(?:\.uk|m)/)) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({
        index: tab.index + 1, 
        url: 'http://dashboard.ophan.co.uk/graph/breakdown?url=' + encodeURIComponent(tab.url)
    });
});