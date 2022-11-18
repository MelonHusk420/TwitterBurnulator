addListeners()

function addListeners() {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        if (message['tweetNow']) {
            sendTweet()
        }

        if (message['findRandom']) {
            chrome.runtime.sendMessage({
                backgroundRedirectRandom: true
            })
        }

        if (message['pressReply']) {
            pressReply()
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", function() {
            findFirst()
        })
    } else {
        findFirst()
    }

}

function sendTweet() {
    // Get the location of the reply box so we can click on it
    const replyBox = document.getElementsByClassName('DraftEditor-root')[0].getBoundingClientRect()

    const x = replyBox.x + Math.random() * replyBox.width / 3
    const y = replyBox.y + Math.random() * replyBox.height

    chrome.runtime.sendMessage({
        backgroundTweetNow: true,
        x: x,
        y: y
    })
}

function pressReply() {
    const replyButton = document.querySelector('[data-testid="tweetButtonInline"]').getBoundingClientRect()

    const x = replyButton.x + Math.random() * replyButton.width
    const y = replyButton.y + Math.random() * replyButton.height

    chrome.runtime.sendMessage({
        backgroundPressReply: true,
        x: x,
        y: y
    })
}

function findFirst() {
    chrome.storage.local.get(['twitterBotOn', 'twitterPostRedirect'], async function(result) {
        if (result.twitterBotOn && result.twitterPostRedirect) {
            let timeStart = Date.now().valueOf()
            let tweetBox = undefined

            while (tweetBox === undefined && timeStart + 5000 > Date.now().valueOf()) {
                await sleep(500)
                try {
                    // Actually finding second, a lot of people have very old pinned tweets apparently
                    tweetBox = document.querySelectorAll('[data-testid="tweet"]')[1].getBoundingClientRect()
                } catch (error) {
                    tweetBox = undefined
                }
            }

            if (tweetBox === undefined)
                return

            chrome.storage.local.set({twitterPostRedirect: false})

            // Because of media link and twitter links, hedge bets on left end below the icon
            // Clicking on a link won't break anything, just no tweet sent this round
            const x = tweetBox.x + Math.random() * tweetBox.width * 0.07
            const y = tweetBox.y + Math.random() * tweetBox.height * 0.9 + tweetBox.height * 0.1

            chrome.runtime.sendMessage({
                backgroundPressReply: true,
                x: x,
                y: y
            })
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}