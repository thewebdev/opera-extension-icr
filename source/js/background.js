﻿var timeIt = null; // data refresh timer
var slider; // slide time delay

function $(v) {
	//DOM: identifies element
	if (document.getElementById(v)) {
		return document.getElementById(v);
	}
}

function E(v) {
	//DOM: creates new element
	return document.createElement(v);
}

function Txt(v) {
	//DOM: creates text nodes
	return document.createTextNode(v);
}

function hide(id) {
	$(id).style.display = 'none';
}

function show(id) {
	$(id).style.display = 'block';
}

function trueRound(value) {
	// Original code from stackoverflow.com 
	// Rounds a float to specified number of decimal places

	var digits = parseInt((widget.preferences.roundoff), 10);
    return (Math.round((value * Math.pow(10, digits)).toFixed(digits - 1)) / Math.pow(10, digits)).toFixed(digits);
}

function createDl(kids) {
	// Creates the definition list used to
	// display the data in the speed dial.
	// The 'kids' parameter specifies how
	// many nodes (dt dd pair) to create.
	// Once the definition list is created,
	// the function only adds or deletes
	// dt dd node pairs as necessary.
	//
	// Opera recommends using createDocumentFragment()
	// as it is faster to create the elements
	// separately and then add to the page.
	
	var dl, dt, dd, txt, temp, temp1;
	var inHtml = document.createDocumentFragment();
	var list = $("rateSlides");
	
	if ($("rateSlides")) {
		// if dl node exists
		
		temp = $("rateSlides").getElementsByTagName('dt');
		
		if (temp.length === kids) {
			return;
		} else if (temp.length < kids) {
			// add more dt dd nodes
			
			var z = kids - temp.length;
			
			for (var a = 0; a < z; a++) {
				dt = E('dt');
				txt = Txt('');
				dt.appendChild(txt);
				
				inHtml.appendChild(dt);
				
				dd = E('dd');
				txt = Txt('');
				dd.appendChild(txt);
				
				inHtml.appendChild(dd);				
			}
			
			$("rateSlides").appendChild(inHtml);
			return;
			
		} else if (temp.length > kids) {
			// delete some dt dd nodes
			
			temp1 = $("rateSlides").getElementsByTagName('dd');
			console.log("bTemp1Type: " + typeof(temp1));
			
			var x = temp.length - kids;
			console.log("Nodes: " + x + " deleted");
			
			while (x !== 0) {
				$("rateSlides").removeChild(temp[0]);
				$("rateSlides").removeChild(temp1[0]);
				x -= 1;
			}
			
			return;
		}
	} 
	
	// create the list and add to the DOM
		
	dl = E('dl');
	dl.setAttribute('id', 'rateSlides');
	
	for (var i = 0; i < kids; i++) {
		dt = E('dt');
		txt = Txt('');
		dt.appendChild(txt);
		
		dl.appendChild(dt);
		
		dd = E('dd');
		txt = Txt('');
		dd.appendChild(txt);
		
		dl.appendChild(dd);
	}

	inHtml.appendChild(dl);
	$('data').appendChild(inHtml);
	
	return;
}

function update(input) {
	// Process the feed data here 
	// and extract the currency pair
	// needed. Prepare it for output.
	
	var temp1;
	var temp2;
	var temp3;
	
	var first;
	var second;
	var pairs;
	
	var rateList;
	var listCount;
	var resources;
	var fields;
	
	var parsedList = {};
	var out = [];		
	
	if (input) {
		// process feed data
	
		// get count of currencies in data
		listCount = input.list.meta.count;
				
		// 1. Extract necessary fields - 
		//    symbol, price & change
		resources = input.list.resources;
		for (var r = 0; r < listCount; r++) {
			fields = resources[r].resource.fields;
			
			temp3 = fields.symbol.trim();
			
			temp3 = temp3.substr(0, 3); // currency symbol
			temp1 = parseFloat(fields.price);  
			temp2 = parseFloat(fields.change); 
			
			parsedList[temp3] = [temp1, temp2]; 
		}
		
		// 2. Get the user specified currency pairs
		pairs = widget.preferences.pairs;
		pairs = JSON.parse(pairs);
		
		// find the currency data needed from
		// the parsed feed list
		for (var i = 0; i < pairs.length; i++) {
			
			temp1 = pairs[i];
			temp1 = temp1.split('/');
			
			first = temp1[0];  
			second = temp1[1];
			
			temp1 = first + " / " + second;
			
			// USD is the base currency
			// So all currency data is for 
			// 1 USD = x currency
			if (first == "USD") { 
				// Scenario 1: 1 USD = x [currency]
				// E.g. USD / EUR
				
				if (parsedList[second][1] < 0) { state = "stronger"; } 
				if (parsedList[second][1] > 0) { state = "weaker"; }
				if (parsedList[second][1] === 0) { state = "same"; }
				
				out[i] = [first, parsedList[second][0], second, state];

			} else { 
				// Scenario 2: 1 [currency] = x USD
				// E.g. EUR / USD
				
				if (parsedList[first][1] > 0) { state = "stronger"; } 
				if (parsedList[first][1] < 0) { state = "weaker"; }
				if (parsedList[first][1] === 0) { state = "same"; }
				
				out[i] = [first, 1/parsedList[first][0], second, state];
			} 
			
			if ((first != "USD") && (second != "USD")) {
				// Scenario 3: 1 [currency] = x [currency] 
				// (cross rate pairs)
				// E.g. AED / INR
				
				// Current value
				temp2 = parsedList[second][0]/parsedList[first][0];
				
				// Previous value  - Determine 
				// based on the 'change'
				temp3 = (parsedList[second][0] + (parsedList[second][1])) / (parsedList[first][0] + (parsedList[first][1]));
				
				// if the current value is more,
				// it indicates that the first currency
				// has weakened and vice versa.
				if (temp2 > temp3) { state = "stronger"; } 
				if (temp2 < temp3) { state = "weaker"; }
				if (temp2 == temp3) { state = "same"; }
				
				out[i] = [first, temp2, second, state];
			}
		}
		
		// send the extracted data for o/p
		refDial("show", out);
		
	} else { 
		refDial("hang");
	}
}

function getData() {
	// Gets the currency rate data from 
	// Yahoo finance - returns a JSON feed.
	
	var data;
	var url = "http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote;currency=true?view=basic&format=json";
	
	refDial('wait');
	var ext = new XMLHttpRequest();

	ext.open('GET', url, true);
	
	ext.onreadystatechange = function (event) {
		if (this.readyState == 4) {
			if (this.status == 200 && this.responseText) {
				data = JSON.parse(this.responseText);
				update(data);
			} else {
				// possible network error -
				// tell the user.
				
				refDial('hang');
			}
		}
	};

	ext.send();	
	
	// console.log ("State: " + ext.readyState + ', Status: ' + ext.status); 
	// console.log("Data: " + data);
	
	return data;
}

function refDial(cmd, out) {
	// Used to show the output
	// in the speed dial. 
	
	if (cmd == "show") {
		// prepare the currency data
		// for display
		
		var dt, dd;
		
		clearInterval(slider);	
		
		// create the definition list
		// structure used to show the data.
		createDl(out.length);
		
		dt = $("rateSlides").getElementsByTagName('dt');
		dd = $("rateSlides").getElementsByTagName('dd');
		
		for (var o = 0; o < out.length; o++) {
			// add data
			
			if (dt[o]) {
				// reset css class
				dt[o].className = "";
				// assign the new data
				dt[o].innerHTML = '<span>1</span> ' + out[o][0];
			} 
			
			if (dd[o]) {
				// reset css class
				dd[o].className = "";	
				// assign the new data				
				dd[o].innerHTML = '<span class="' + out[o][3] + '">' + trueRound(out[o][1]) + '</span> ' + out[o][2];
			}			
		}
		
		dt[0].className = 'current';
		dd[0].className = 'current';
		
		hide("wait");
		show("data");
		
		// each data is displayed
		// for 5 seconds
		slider = setInterval(startSlide, 5000);
		
		// start displaying the data
		startSlide(out.length);
		return;
	}
	
	if (cmd == "wait") {
		// used to indicate that an
		// update of data is underway
		
		$("msg").firstChild.nodeValue = "updating";

		clearInterval(slider);			
		hide("data");
		show("wait");
		
		return;
	}
	
	if (cmd == "hang") {
		// indicate some error
		// has occured
		
		$("msg").firstChild.nodeValue = "Possible network error. Will retry after some time.";
		
		clearInterval(slider);	
		hide("data");
		show("wait");		
		
		return;
	} 
}

function startSlide(count) {
	// Displays the data.
	// Cycles through each dt dd pair
	// and marks it with css class name 
	// 'current' to display it while
	// the other pairs remain hidden.
	
	var cls;
	var dt;
	var dd;
	var done;
	var tempDt;
	var tempDd;
	
	done = false;
	tempDt = [];
	tempDd = [];

	dt = $("rateSlides").getElementsByTagName('dt');
	dd = $("rateSlides").getElementsByTagName('dd');

	for (var e=0; e < dt.length; e++) {
		// Copy the DOM dt element and
		// make changes to that.
		tempDt[tempDt.length] = dt[e];
	}
	
	for (var i = 0; i < tempDt.length; i++) {
		if (done) { 
			// Once a dt element has been marked
			// 'current', no need to go through
			// the rest of it as we display only
			// one dt element at a time.
			
			continue; 
		}
		
		cls = tempDt[i].className;
		
		if ((cls.indexOf("current")) != -1) {
			
			// unmark the currently displayed dt
			tempDt[i].className = "";
			
			if (i == (tempDt.length-1)) {
				// if we have reached the last 
				// dt, mark the first dt again.
			
				tempDt[0].className = 'current';
			} else {
				tempDt[i+1].className = 'current';
			}
			
			done = true;
		}
	}

	tempDt = null;
	done = false;

	// do the same thing for dd element
	// as we did for the dt element in
	// the code above.
	
	for (var s=0; s < dd.length; s++) {
		tempDd[tempDd.length] = dd[s];
	}
	
	for (var t = 0; t < tempDd.length; t++) {
		if (done) { continue; }
		
		cls = tempDd[t].className;
		
		if ((cls.indexOf("current")) != -1) {
			
			tempDd[t].className = "";

			if (t === (tempDd.length-1)) {
				tempDd[0].className = 'current';
			} else {
				tempDd[t+1].className = 'current';
			}
			
			done = true;
		}
	}
	
	tempDd = null;
}

function reconfigure(e) {
	// This code didn't work as expected.
	// Needs more testing to figure out if
	// it was some opera bug. It's here as 
	// as a stub for future versions.
	// It is meant to update the speed dial
	// with the new options set by the user.

	if (e.storageArea != widget.preferences) return;
	switch(e.key) {
		case 'interval': setRefreshTimer(); break;
	}
}

function setRefreshTimer() {
	clearInterval(slider);
	slider = setInterval(startSlide, 4000);
}

function init() {
	// some basic settings intialised here
	// to get the extension running
		
	if (!widget.preferences.pairs) {
		// Set default currency pair for new
		// installation. The 'pairs' key stores
		// the currency pairs as an array in JSON.
		//
		// WARNING: Possible opera bug. When a 
		// javascript occurs in the extension, opera
		// messes up the JSON in 'pairs' key and this
		// extension becomes unstable / unusable.
		// Recommended solution is to re-install the
		// extension again.
		
		var c = ["USD/EUR"];
		widget.preferences.pairs = JSON.stringify(c);
	}
	
	// monitors if options are updated and 
	// saved in widget preferences.
	window.addEventListener('storage', reconfigure, false);
	
	// The 'interval' key in the preferences 
	// specifies the delay between updates.
	// Unit: minute
	timeIt = setInterval(getData, parseInt((widget.preferences.interval), 10) * 60 * 1000);
	
	getData();
}

// monitor and inform when index.html is ready
document.addEventListener('DOMContentLoaded', init, false);