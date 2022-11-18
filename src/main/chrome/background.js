let attachedTabId = 0
let sourceText = ""
let accountsList = []

// If the switch is on, every 60-90 seconds-ish tweet out something
setInterval( function() {
    chrome.storage.local.get(['twitterTabId', 'twitterBotOn'], async function(result) {
        if (result.twitterBotOn) {
            // Load random page from accounts.txt
            chrome.tabs.sendMessage(result.twitterTabId, {findRandom: true})

            // Wait for page load and add some randomness
            await sleep(Math.floor(Math.random() * 5 * 1000 + 5 * 1000))

            // Send tweet
            chrome.tabs.sendMessage(result.twitterTabId, {tweetNow: true})
        }
    })
}, Math.floor(Math.random() * 30 * 1000 + 60 * 1000))

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    chrome.storage.local.get(['twitterTabId', 'twitterBotOn'], function(result) {
        if (result.twitterBotOn) {
            const tabId = result.twitterTabId
            if (message['backgroundTweetNow']) {
                sendTweet(
                    message['x'],
                    message['y'],
                    tabId
                ).then()
            }

            if (message['backgroundPressReply']) {
                pressReply(
                    message['x'],
                    message['y'],
                    tabId
                ).then()
            }

            if (message['backgroundRedirectRandom']) {
                findRandomTarget(tabId).then()
            }

            if (message['detachDebugger']) {
                detachTabs()
            }
        }
    })
})

async function sendTweet(x, y, tabId) {
    await attachTab(tabId)
    await clickButton(x, y)
    await typeTweet()

    // Button may have moved, need to let content script know to go get it, but wait a tick first
    await sleep(Math.floor(Math.random() * 400 + 500))
    chrome.tabs.sendMessage(tabId, {pressReply: true, tabId: tabId})
}

async function pressReply(x, y, tabId) {
    await attachTab(tabId)
    await clickButton(x, y)
}

async function clickButton(x, y) {
    let lx = Math.floor(parseFloat(x))
    let ly = Math.floor(parseFloat(y))

    // Move mouse to area
    chrome.debugger.sendCommand({tabId: attachedTabId}, 'Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: lx,
        y: ly
    })

    // Wait between 100 and 200ms before clicking
    await sleep(Math.floor(Math.random() * 100 + 100))

    // Left click
    chrome.debugger.sendCommand({tabId: attachedTabId}, 'Input.dispatchMouseEvent', {
        type: 'mousePressed',
        button: 'left',
        x: lx,
        y: ly,
        clickCount: 1
    })

    // Press button for between 50 and 100ms
    await sleep(Math.floor(Math.random() * 50 + 50))

    // Left release
    chrome.debugger.sendCommand({tabId: attachedTabId}, 'Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        button: 'left',
        x: lx,
        y: ly,
        clickCount: 1
    })
}

async function typeTweet() {
    let tweet = await getText()
    for (let i = 0; i < tweet.length; i++) {
        const c = tweet.charAt(i)
        // Press shift if it's an uppercase
        if (c.toUpperCase() === c) {
            chrome.debugger.sendCommand({tabId: attachedTabId}, 'Input.dispatchKeyEvent', {
                type: 'keyDown',
                windowsVirtualKeyCode: 16,
                nativeVirtualKeyCode: 16,
                macCharCode: 16
            })
            // Pause for 30 to 60ms
            await sleep(Math.floor(Math.random() * 30 + 30))
        }

        // Press and release the key
        chrome.debugger.sendCommand({tabId: attachedTabId}, 'Input.dispatchKeyEvent', {
            type: 'keyDown',
            text: c
        })
        // hold key for 40 to 80ms
        await sleep(Math.floor(Math.random() * 40 + 40))
        chrome.debugger.sendCommand({tabId: attachedTabId}, 'Input.dispatchKeyEvent', {
            type: 'keyUp',
            text: c
        })

        // Release shift if needed
        if (c.toUpperCase() === c) {
            // Pause for 30 to 60ms
            await sleep(Math.floor(Math.random() * 30 + 30))
            chrome.debugger.sendCommand({tabId: attachedTabId}, 'Input.dispatchKeyEvent', {
                type: 'keyUp'
            })
        }

        // Wait for 85 to 135ms between key presses
        await sleep(Math.floor(Math.random() * 50 + 85))
    }
}

async function attachTab(tabId) {
    if (attachedTabId !== tabId) {
        detachTabs()
        chrome.debugger.attach({ tabId: tabId }, "1.3");
        attachedTabId = tabId
    }
}

function detachTabs() {
    chrome.tabs.query({url: "https://twitter.com/"}, function(tabs) {
        for (let tab in tabs) {
            chrome.debugger.detach({ tabId: tab.id });
        }
    })

    attachedTabId = 0
}

async function getText() {
    await loadSourceText()

    // Pick a random character to start with
    let start = Math.floor(Math.random() * sourceText.length)

    // Find the previous terminal character
    const terminals = ['.', '!', '?', '\n', '\t']
    while (!terminals.includes(sourceText[start]) && start > 0) {
        start--
    }

    // FF to next letter
    while (sourceText[start].toLowerCase() === sourceText[start].toUpperCase()) {
        start++
    }

    // Make sure we didn't just start a quote
    if (start > 0 && sourceText[start - 1] === "\"") {
        start--
    }

    // Find the last terminal character
    let end = start + 280
    while (!terminals.includes(sourceText[end]) && end > start) {
        end--
    }

    if (end === start) {
        end = start + 280
    }

    // Return the chosen clip
    const chosenText = sourceText.substring(start, end + 1)
    console.log("Chosen text = " + chosenText)

    return chosenText
}

async function loadSourceText() {
    if (sourceText === "") {
        const url = chrome.runtime.getURL("data/source.txt")
        await fetch(url).then(response => response.text())
            .then(textString => {
                    sourceText = textString

                    // If it was a windows based file, get rid of the \r crap
                    sourceText = sourceText.replace(/\r/g, "")
                    // Get rid of newlines, but keep paragraph breaks. Probably a better way to do this, but only loads once.
                    sourceText = sourceText.replace(/\n\n/g, "~~~~~")
                    sourceText = sourceText.replace(/\n/g, " ")
                    sourceText = sourceText.replaceAll("~~~~~", "\n\n")
                }
            )
    }
}

async function loadAccountsList() {
    if (accountsList.length === 0) {
        const url = chrome.runtime.getURL("data/accounts.txt")
        await fetch(url).then(response => response.text())
            .then(textString => {
                let lines = ""
                if (textString.includes("\r")) {
                    lines = textString.split("\r\n")
                } else {
                    lines = textString.split("\n")
                }

                lines.forEach((line) => {
                    accountsList.push(line)
                })
            })
    }
}

async function findRandomTarget(tabId) {
    await loadAccountsList()
    const target = accountsList[Math.floor(Math.random() * accountsList.length)]
    console.log("Redirecting to " + target)
    chrome.tabs.update(
        tabId,
        {url: "https://twitter.com/" + target}
    )

    chrome.storage.local.set({twitterPostRedirect: true})
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}