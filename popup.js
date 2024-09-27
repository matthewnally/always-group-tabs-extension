// document.getElementById("renameBtn").addEventListener("click", function () {
//   const newGroupName = document.getElementById("groupName").value;

//   if (newGroupName) {
//     // Send the new group name to the background script
//     chrome.runtime.sendMessage({
//       action: "rename-group",
//       groupName: newGroupName,
//     });
//   }
// });
document.addEventListener("DOMContentLoaded", function () {
  // Automatically focus the input field when the popup opens
  document.getElementById("groupName").focus();

  // Event listener for the Enter key press
  document
    .getElementById("groupName")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        renameGroup();
      }
    });
});

function renameGroup() {
  const newGroupName = document.getElementById("groupName").value;

  // Send message to background script to rename the tab group
  chrome.runtime.sendMessage({
    action: "rename-group",
    groupName: newGroupName,
  });
  window.close(); // Close the popup window after renaming
}
