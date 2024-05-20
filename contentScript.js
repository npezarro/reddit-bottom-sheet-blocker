
// Function to remove the element specified by selector
function removeElementBySelector(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.parentElement.removeChild(element);
    console.log(`${selector} removed.`);
  });
}

// Automatically attempt to remove the xpromo-bottom-sheet and shreddit-experience-tree
removeElementBySelector('#bottom-sheet');
removeElementBySelector('shreddit-experience-tree');

// MutationObserver to dynamically remove the xpromo-bottom-sheet and shreddit-experience-tree if they appear later
const observer = new MutationObserver((mutations, obs) => {
  removeElementBySelector('#bottom-sheet');
  removeElementBySelector('shreddit-experience-tree');
  // Remove additional selectors if specified
  chrome.storage.sync.get({selectors: []}, function(data) {
    data.selectors.forEach(selector => removeElementBySelector(selector));
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from the extension to remove specified elements
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "removeElement" && request.selector) {
      removeElementBySelector(request.selector);
      sendResponse({result: "success", message: `Attempted to remove elements matching ${request.selector}`});
    }
  }
);

// Initial run to remove additional selectors if specified
chrome.storage.sync.get({selectors: []}, function(data) {
  data.selectors.forEach(selector => removeElementBySelector(selector));
});
