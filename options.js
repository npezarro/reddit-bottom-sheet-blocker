
const prebuiltSelectors = ['#bottom-sheet', 'shreddit-experience-tree'];

// Function to save options to chrome.storage
function saveOptions() {
  const newSelector = document.getElementById('newSelector').value;
  if (newSelector) {
    chrome.storage.sync.get({selectors: []}, function(data) {
      const selectors = data.selectors;
      selectors.push(newSelector);
      chrome.storage.sync.set({selectors: selectors}, function() {
        displaySelectors();
        document.getElementById('newSelector').value = '';
      });
    });
  }
}

// Function to display saved options
function displaySelectors() {
  chrome.storage.sync.get({selectors: []}, function(data) {
    const selectorsList = document.getElementById('selectorsList');
    selectorsList.innerHTML = '';
    
    prebuiltSelectors.forEach(selector => {
      const li = document.createElement('li');
      li.textContent = selector;
      selectorsList.appendChild(li);
    });

    data.selectors.forEach((selector, index) => {
      const li = document.createElement('li');
      li.textContent = selector;
      const button = document.createElement('button');
      button.textContent = 'Remove';
      button.onclick = function() {
        removeSelector(index);
      };
      li.appendChild(button);
      selectorsList.appendChild(li);
    });
  });
}

// Function to remove a selector
function removeSelector(index) {
  chrome.storage.sync.get({selectors: []}, function(data) {
    const selectors = data.selectors;
    selectors.splice(index, 1);
    chrome.storage.sync.set({selectors: selectors}, function() {
      displaySelectors();
    });
  });
}

document.getElementById('addSelector').addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', displaySelectors);
