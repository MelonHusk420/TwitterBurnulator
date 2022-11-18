# twitterBurnulator
Spam randos with this handy Twitter bot

# Install instructions
* Download to your local computer
* In Chrome go to the extensions manager - `chrome://extensions/`
* Press `Load unpacked` button and direct to the directory you saved to then `/src/main/chrome`, `select folder`
* Open up a new tab and go to [Twitter](https://twitter.com/)
* Press the extensions dropdown (puzzle piece) on the top right extensions tray, pin Twitter Burnulator
* Click the bird and flip the slider
* The first tweet may take up to 90 seconds to start depending on timing
* You may need to shrink your text size a bit. To avoid pinned tweets it'll take the second tweet which isn't always visible at 100% text size. This won't break anything, it just won't tweet when it can't see the second one.

# To stop
Click the slider back to off to stop going to new pages and tweeting. This won't stop a tweet already being typed

If you need to stop a tweet already being typed you can close the tab or in the extension pop up press the `Emergency Stop` button which turns off the toggle and removes the debugger. You may need to close the tab and open a new one to start up again.

# To customize
There are two main areas to customize currently. First is `accounts.txt` which is the list of accounts to reply to at random. The supplied list is all current congresspersons, POTUS, VP, governors, and Elon. Pretty simple, one handle per line.

The second is the source file for the tweets themselves. Name whatever you want to use as `source.txt`. The supplied source is A Christmas Carol, and there's a secondary one of Moby Dick, depending on the mood. Feel free to put whatever you want there.
It just selects a random character in the file, backtracks to find the start of the sentence, and then does the same 280 characters later and tweets whatever was in between. It's not the most efficient, but it'll put stuff in a tweet.

# Uninstallation
* In Chrome go to the [extensions manager](chrome://extensions/)
* Find the Twitter Burnulator extension
* Click `Remove`

# FAQ
Q: Why did you use the debugger?

A: I wanted to make it more difficult for automated checks to catch. By using mouse and keyboard input events and slowing the rate down, most simple automated checks won't be able to detect it. There are many more complicated checks that could catch it using past user behavior or biometric style data, but these are often kind of slow and expensive so if Twitter ever had them, it's likely Elon has already turned them off.

---
Q: Why is it so slow?

A: My goal wasn't to try and take down the site, it was to make the site as useless as possible. Mimicking human behavior and targetting certain individuals makes it more difficult to get information out. Moreover it wastes moderation time. There are few human moderators left and the more time they have to spend figuring out if you're human or bot, the less time they have to weed out the more destructive bots. So by behaving 'more human' we either waste their time or more likely get ignored.

---
Q: This code is ass, it looks like you aren't even a front end programmer.

A: I'm not, and that's not a question. I very rarely touch front end code and even more rarely touch JS, plus I threw this together in a few hours. It's crap code and barely tested. I'm okay with that.

---
Q: Can I help make it less crap?

A: Absolutely. You can send merge requests if you'd like, but I'd also encourage you just to fork it. The more variations there are the harder it will be for the one remaining engineer to do anything about it. Plus I do not plan to sit here and babysit merge requests all week.
