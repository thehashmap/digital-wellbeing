const getSiteTime = (site) => {
  chrome.runtime.sendMessage({ cmd: "getTime", site: site }, (response) => {
    document.getElementById(`${site}Time`).textContent = `${
      response / 60000
    } minutes`; // Convert ms to minutes
  });
};

document.getElementById("reset").addEventListener("click", () => {
  chrome.storage.sync.set({ "twitter.com": 0, "instagram.com": 0 }, () => {
    getSiteTime("twitter.com");
    getSiteTime("instagram.com");
  });
});

getSiteTime("twitter.com");
getSiteTime("instagram.com");
