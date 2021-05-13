// global variables
var timeElapsedPrecision = '0';
var bufferTime = 1000; // in miliseconds
const MIDNIGHT = new Date (Date.now()); // set midnight time
MIDNIGHT.setHours(0, 0, 0);
const ARRAYMAX = 4294967296; // max array size, for history.search

function setTimeAgoString(period) {
	var mili = Math.floor(period%1000);
	var sec = Math.floor(period/1000)%60;
	var min = Math.floor(period/(1000*60))%60;
	var hr = Math.floor(period/(1000*60*60));
	var str = '';

	browser.storage.local.get('unit', function(data) {
		timeElapsedPrecision = data.unit;

		/* switch statement
		* falls through so that the time from the least precise on is calculated
		* eg precision to seconds starts at case 1, so sec, min, hr all calculated
		* rounds up if necessary
		*/
		switch (timeElapsedPrecision) {
			case '0':
			if (mili==1) {
				str+=mili+' millisecond ';
			} else if (mili>1) {
				str+=mili+' milliseconds ';
			}

			case '1':
			// rounding
			if (timeElapsedPrecision=='1' && mili>=500) sec+=1;
			if (sec==1) {
				str = sec+' second ' + str;
			} else if (sec>1) {
				str = sec+' seconds ' + str;
			}

			case '2':
			// rounding
			if (timeElapsedPrecision=='2' && sec>=30) min+=1;
			if (min==1) {
				str = min+' minute ' + str;
			} else if (min>1) {
				str = min+' minutes ' + str;
			}

			case '3':
			// rounding
			if (timeElapsedPrecision=='3' && min>=30) hr+=1;
			if (hr==1) {
				str = hr+' hour ' + str;
			} else if (hr>1) {
				str = hr+' hours ' + str;
			}
		}

		if (str.length>0) {
			str += 'ago';
			// add line break before time-ago
			const testElement = document.getElementById('last-visit');
			testElement.appendChild(document.createElement('br'));
		} else {
			str = 'just now';
		}

		document.getElementById('time-ago').textContent = str;

	});
}


function setVisits(historyItems) {

	console.log('there are '+historyItems.length+' history items');

	if (historyItems.length>1) {
		const thisVisit = new Date(historyItems[0].lastVisitTime);
		var lastVisit = new Date(historyItems[1].lastVisitTime);

		// to handle pages that redirect/reload (e.g. wikipedia)
		var count = 2;
		while ((thisVisit-lastVisit) < bufferTime && historyItems.length>count) {
			lastVisit = new Date(historyItems[count].lastVisitTime);
			count++;
		}

		// updating display text
		document.getElementById('visits').textContent = historyItems.length;
		document.getElementById('last-visit').textContent = lastVisit.toLocaleTimeString();
		var timeElapsed = Date.now()-lastVisit;
		setTimeAgoString(timeElapsed); // sets time-ago

	} else {
		document.getElementById("stats1").textContent = "This is the first visit today"
		document.getElementById('visits').style.fontWeight = 'normal';
		document.getElementById('visits').textContent = 'No';
	}
}

function getHistory(domain) {
	var searched = browser.history.search({
		text: domain,
		startTime: MIDNIGHT,
		maxResults: ARRAYMAX});
	searched.then(setVisits);

}

function setDomain(domain) {
	document.getElementById('domain').textContent = domain;
}

// gets the domain name of the url
function getDomain(tabs) {
	const tabURL = new URL(tabs[0].url);
	var domain = tabURL.hostname;
	setDomain(domain);
	getHistory(domain);
}

// code starts here

// get settings from storage
browser.storage.local.get('unit', function(data) {
	timeElapsedPrecision = data.unit;
	bufferTime = data.bufferTime;
});


// get current tab info (and pass it along)
// note that activeTabs is a one element array
let activeTabsPromise = browser.tabs.query({currentWindow: true, active: true});
activeTabsPromise.then(getDomain);



