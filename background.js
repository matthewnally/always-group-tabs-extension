chrome.tabs.onCreated.addListener((tab) => {
  console.log("Tab Created:", tab.url); // Log the URL when a tab is created

  // Use onUpdated to check when the tab's URL is set or updated
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, updatedTab) {
    // Ensure this runs only for the tab that was just created and when the URL is updated
    if (tabId === tab.id && changeInfo.url) {
      console.log("Tab Updated:", updatedTab.url); // Log the updated URL

      // Check if the tab is created as a new tab or has no URL
      if (updatedTab.url === "chrome://newtab/" || updatedTab.url === "") {
        // Create a new tab group
        chrome.tabs.group({ tabIds: [updatedTab.id] }, (groupId) => {
          chrome.tabGroups.update(groupId, { title: `` });
        });
      }
    }
  });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "rename-group") {
    const newGroupName = message.groupName;

    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab) return;

      // Get the tab group ID
      const groupId = currentTab.groupId;
      if (groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
        console.log("Tab is not part of any group.");
        return;
      }

      // Rename the tab group
      chrome.tabGroups.update(groupId, { title: newGroupName }, () => {
        console.log(`Tab group renamed to: ${newGroupName}`);
      });
    });
  }
});
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: contentScriptFunc,
    args: ["action"],
  });
});

function contentScriptFunc(name) {
  alert(`"${name}" executed`);
}
