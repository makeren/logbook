// checks if the tab is an about: page
// if so disables browserAction (add-on)
function checkAboutPage(tabId, changeInfo, tab) {
	const tabURL = new URL(tab.url);
	var protocol = tabURL.protocol;

	if (protocol == 'about:') {
		browser.browserAction.disable();	
	} else {
		browser.browserAction.enable();	
	}
}

browser.tabs.onUpdated.addListener(checkAboutPage);
