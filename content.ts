const site = window.location.host;
chrome.runtime.sendMessage({ cmd: "checkTime", site: site }, (response) => {
  if (response.block) {
    alert("You've reached your time limit for today!");
    window.location.href = "about:blank";
  }
});
