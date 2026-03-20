
// Function to remove the element specified by selector
function removeElementBySelector(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.parentElement.removeChild(element);
    console.log(`${selector} removed.`);
  });
}

// Cache custom selectors in memory to avoid IPC on every DOM mutation
let cachedSelectors = [];

// Load custom selectors from storage once at startup
chrome.storage.sync.get({selectors: []}, function(data) {
  cachedSelectors = data.selectors;
  // Initial run to remove all targets
  removeAllTargets();
});

// Update cached selectors when storage changes
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'sync' && changes.selectors) {
    cachedSelectors = changes.selectors.newValue || [];
  }
});

// Remove all targeted elements (built-in + custom selectors)
function removeAllTargets() {
  removeElementBySelector('#bottom-sheet');
  removeElementBySelector('shreddit-experience-tree');
  cachedSelectors.forEach(selector => removeElementBySelector(selector));
}

// Automatically attempt to remove on load
removeElementBySelector('#bottom-sheet');
removeElementBySelector('shreddit-experience-tree');

// MutationObserver to dynamically remove elements as they appear
const observer = new MutationObserver(() => {
  removeAllTargets();
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
