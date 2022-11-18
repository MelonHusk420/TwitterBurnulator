document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['twitterBotOn'], function(result) {
        document.getElementById('ToggleOn').checked = result.twitterBotOn
    })
    addListeners()
})

function addListeners() {
    document.getElementById('ToggleOn').addEventListener('change', function (box) {
        if (box.target.checked) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.storage.local.set({twitterBotOn: true, twitterTabId: tabs[0].id})
            })
        } else {
            chrome.storage.local.set({twitterBotOn: false})
        }
    })

    document.getElementById('DetachDebugger').addEventListener('click', () => {
        chrome.storage.local.set({twitterBotOn: false})
        chrome.runtime.sendMessage({detachDebugger: true})
    })
}