document.addEventListener('DOMContentLoaded', () => {
  const showDetailsButton = document.getElementById('show-details');
  showDetailsButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'details.html' });
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    chrome.storage.local.get(['linksData'], function (result) {
      let linksData = result.linksData || {};
      let linksForCurrentTab = linksData[currentTab.url] || {};
      let totalLinks = Object.keys(linksForCurrentTab).length;
      document.getElementById('count').textContent = `Hyperlinks: ${totalLinks}`;
    });
  });
});
