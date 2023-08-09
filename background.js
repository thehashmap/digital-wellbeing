"use strict";
const MAX_TIME = 10 * 60 * 1000; // 10 minutes
let startTime = null;
chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.includes("twitter.com") ||
        details.url.includes("instagram.com")) {
        if (!startTime) {
            startTime = new Date();
        }
    }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.cmd === "checkTime") {
        chrome.storage.sync.get([message.site], (result) => {
            const currentTime = new Date();
            const elapsedTime = startTime
                ? currentTime.getTime() - startTime.getTime()
                : 0;
            if (!result[message.site]) {
                result[message.site] = 0;
            }
            const totalTime = result[message.site] + elapsedTime;
            if (totalTime > MAX_TIME) {
                sendResponse({ block: true });
            }
            else {
                sendResponse({ block: false });
                chrome.storage.sync.set({ [message.site]: totalTime });
            }
        });
    }
    else if (message.cmd === "getTime") {
        chrome.storage.sync.get([message.site], (result) => {
            sendResponse(result[message.site] || 0);
        });
    }
});
// Reset timer at midnight
const setMidnightTrigger = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const timeToMidnight = midnight.getTime() - now.getTime();
    setTimeout(() => {
        chrome.storage.sync.set({ "twitter.com": 0, "instagram.com": 0 }, () => {
            setMidnightTrigger(); // Set again for the next day
        });
    }, timeToMidnight);
};
setMidnightTrigger();
