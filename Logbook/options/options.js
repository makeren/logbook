var unit = 0;
var bufferTime = 1000;
var form = document.querySelector("form");

function saveOptions(e) {
	browser.storage.local.set({
		unit: this.unit,
		bufferTime: this.bufferTime
	});
	e.preventDefault();
}

function restoreOptions() {
	var getItem = browser.storage.local.get('unit');
	getItem.then((res)=> {
		document.querySelector(res).setChecked();
	});
}

form.addEventListener('DOMContentLoaded', restoreOptions);

form.addEventListener("submit", function(event) {
	var data = new FormData(form);
	unit = data.get('unit');
	bufferTime = data.get('bufferTime');

	saveOptions(event);
	event.preventDefault();
}, false);