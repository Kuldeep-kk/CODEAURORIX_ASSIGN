document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#details-table tbody');

  chrome.storage.local.get(['linksData'], function (result) {
    let linksData = result.linksData || {};

    for (let pageUrl in linksData) {
      const pageLinks = linksData[pageUrl];
      for (let link in pageLinks) {
        const count = pageLinks[link];
        const row = tbody.insertRow();
        const siteCell = row.insertCell(0);
        const linkCell = row.insertCell(1);
        const countCell = row.insertCell(2);

        siteCell.textContent = new URL(pageUrl).hostname;
        linkCell.textContent = link;
        countCell.textContent = count;
      }
    }
  });
});
