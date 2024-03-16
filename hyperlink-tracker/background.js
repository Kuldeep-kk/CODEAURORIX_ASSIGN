chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: trackLinks,
      args: [tab.url]
    });
  }
});

function trackLinks(url) {
  const links = Array.from(document.querySelectorAll('a')).map(link => link.href);
  chrome.storage.local.get({ linksData: {} }, function (result) {
    let linksData = result.linksData;
    linksData[url] = linksData[url] || {};
    
    links.forEach(link => {
      linksData[url][link] = (linksData[url][link] || 0) + 1;
    });

    chrome.storage.local.set({ linksData });
  });
}
