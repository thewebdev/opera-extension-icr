var timeIt = null; // data refresh timer
var delay;  // retry data access timer
var slider; // slide time delay

function $(v) {
	if (document.getElementById(v)) {
		return document.getElementById(v);
	}
}

function E(v) {
	return document.createElement(v);
}

function Txt(v) {
	return document.createTextNode(v);
}

function hide(id) {
	$(id).style.display = 'none';
}

function show(id) {
	$(id).style.display = 'block';
}

function trueRound(value){
	var digits = parseInt(widget.preferences.roundoff);
	console.log("Digit: " + digits);
    return (Math.round((value*Math.pow(10,digits)).toFixed(digits-1))/Math.pow(10,digits)).toFixed(digits);
}

function createDl(kids) {
	var dl, dt, dd, txt, temp, temp1;
	var inHtml = document.createDocumentFragment();
	var list = $("rateSlides");
	
	if ($("rateSlides")) {
		// if dl node exists
		temp = $("rateSlides").getElementsByTagName('dt');
		console.log("bTempType: " + typeof(temp));
		
		if (temp.length == kids) {
			console.log("Nodes: equal");
			return;
		} else if (temp.length < kids) {
			// add more dt dd nodes
			
			var z = kids - temp.length;
			console.log("Nodes: " + z + " added");
			
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
			
			while (x != 0) {
				$("rateSlides").removeChild(temp[0]);
				$("rateSlides").removeChild(temp1[0]);
				x -= 1;
			}
			
			return;
		}
	} 
	
	// create and add to the DOM
		
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
	
	var parsedList = new Object;
	var out = [];		
	
	if (input) {
		//console.log("List: " + input);
		// parse data
	
		// get count of currencies in data
		listCount = input.list.meta.count; 
		resources = input.list.resources;
		
		//console.log("Count: " + listCount);
		
		// 1. Extract necessary fields - symbol, price & change
		for (var r = 0; r < listCount; r++) {
			fields = resources[r].resource.fields;
			
			temp3 = fields.symbol.trim();
			temp3 = temp3.substr(0, 3);
			
			temp1 = parseFloat(fields.price);
			temp2 = parseFloat(fields.change);
			
			parsedList[temp3] = [temp1, temp2];
		}
		
		//console.log("Parsed: " + parsedList);
		
		// 2. Get the user specified currency pairs
		pairs = widget.preferences.pairs;
		pairs = JSON.parse(pairs);
		
		console.log("bPairs: " + pairs);
		console.log("bType: " + typeof(pairs));
		
		for (var i = 0; i < pairs.length; i++) {
			
			temp1 = pairs[i];
			console.log("bPairs[i]: " + pairs[i]);
			temp1 = temp1.split('/');
			console.log("bSplit: " + pairs[i] + "=" + temp1);
			
			first = temp1[0];
			second = temp1[1];
			
			console.log("bPair val: " + first + ' / ' + second);
			
			temp1 = first + " / " + second;
			
			//console.log("Currency: " + temp1 + '-' + i + first + second);
			//console.log("Parse: " + parsedList[second][1])
			
			// USD is the base currency
			if (first === "USD") { // Scenario 1: USD / x
				
				if (parsedList[second][1] < 0) { state = "stronger"; } 
				if (parsedList[second][1] > 0) { state = "weaker"; }
				if (parsedList[second][1] == 0) { state = "same"; }
				
				out[i] = [first, parsedList[second][0], second, state];

			} else { // Scenario 2: x / USD
				
				if (parsedList[first][1] > 0) { state = "stronger"; } 
				if (parsedList[first][1] < 0) { state = "weaker"; }
				if (parsedList[first][1] == 0) { state = "same"; }
				
				out[i] = [first, 1/parsedList[first][0], second, state];
			} 
			
			// Scenario 3: x / x (cross rate)
			if ((first != "USD") && (second != "USD")) {
				// price calculation with USD as base
				
				// Current value
				temp2 = parsedList[second][0]/parsedList[first][0];
				
				// Previous value
				temp3 = (parsedList[second][0] + (parsedList[second][1])) / (parsedList[first][0] + (parsedList[first][1]));

				//console.log("Change: " + temp2 + ',' + temp3);
				
				// if the current value is more,
				// it indicates that the first currency
				// has weakened and vice versa.
				if (temp2 > temp3) { state = "stronger"; } 
				if (temp2 < temp3) { state = "weaker"; }
				if (temp2 == temp3) { state = "same"; }
				
				out[i] = [first, temp2, second, state];
			}
		}
		
		//console.log("Output: " + out);
		refDial("show", out);
		
	} else {
		refDial("hang");
	}
}

// get json feed from Yahoo Finance
function getData() {
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
				refDial('hang');
			}
		}
	}

	ext.send();	
	
	// console.log ("State: " + ext.readyState + ', Status: ' + ext.status); 
	// console.log("Data: " + data);
	
	return data;
}

// display in speed dial
function refDial(cmd, out) {
	
	// display exchange rate data
	if (cmd === "show") {
		//console.log("Cmd show");
		var cls, dt, dd;
		
		clearInterval(slider);	
		
		createDl(out.length);
		console.log("Out: " + out.length);
		
		dt = $("rateSlides").getElementsByTagName('dt');
		dd = $("rateSlides").getElementsByTagName('dd');
		
		console.log("Dt/Dd: " + dt.length + ', ' + dd.length);
		
		for (var o = 0; o < out.length; o++) {

			console.log("Dt[o]: " + dt[o]);
			console.log("Out[o]: " + out[o]);
			
			if (dt[o]) {
				// remove old css class
				dt[o].className = "";
				// assign new data
				dt[o].innerHTML = '<span>1</span> ' + out[o][0];
			} else {
				console.log("Not Assigned to Dt!");
			}
			
			if (dd[o]) {
				// remove old css class
				dd[o].className = "";	
				// assign new data				
				dd[o].innerHTML = '<span class="' + out[o][3] + '">' + trueRound(out[o][1]) + '</span> ' + out[o][2];
			} else {
				console.log("Not Assigned to Dd!");
			}			
		}
		
		dt[0].className = 'current';
		dd[0].className = 'current';
		
		//output.innerHTML = html;
		hide("wait");
		show("data");
		
		slider = setInterval(startSlide, 5000);
		startSlide(out.length);
		return
	}
	
	// indicate data refresh
	if (cmd === "wait") {

		//console.log("Cmd wait");
		
		//html = '<div><img src="pix/loading.gif" alt="Loading ...">';
		//html = html + '<p>updating</p>';
		//output.innerHTML = html;
		
		$("msg").firstChild.nodeValue = "updating";

		clearInterval(slider);			
		hide("data");
		show("wait");
		
		return
	}
	
	// indicate network error
	if (cmd === "hang") {
		//html = '<div><img src="pix/loading.gif" alt="Loading ...">';
		//html = html + '<p>hung</p>';
		//output.innerHTML = html;
		//console.log("Cmd hang");
		
		$("msg").firstChild.nodeValue = "Possible network error. Will retry after some time.";
		
		clearInterval(slider);	
		hide("data");
		show("wait");		
		
		return
	} 
}

function startSlide(count) {
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
		tempDt[tempDt.length] = dt[e];
	}
	
	for (var i = 0; i < tempDt.length; i++) {
		if (done) { continue; }
		
		cls = tempDt[i].className;
		//console.log("ClassDt: " + i + cls);
		
		if ((cls.indexOf("current")) != -1) {
			//console.log("true");
			
			tempDt[i].className = "";
			
			if (i == (tempDt.length-1)) {
				tempDt[0].className = 'current';
			} else {
				tempDt[i+1].className = 'current';
			}
			
			done = true;
		}
	}

	tempDt = null;
	done = false;

	for (var s=0; s < dd.length; s++) {
		tempDd[tempDd.length] = dd[s];
	}
	
	for (var t = 0; t < tempDd.length; t++) {
		if (done) { continue; }
		
		cls = tempDd[t].className;
		//console.log("ClassDd: " + t + cls);
		
		if ((cls.indexOf("current")) != -1) {
			//console.log("true");
			
			tempDd[t].className = "";
			//console.log("Replaced: " + tempDd[t].className);
			if (t === (tempDd.length-1)) {
				tempDd[0].className = 'current';
				//console.log("New: " + tempDd[0].className);
			} else {
				tempDd[t+1].className = 'current';
				//console.log("New: " + tempDd[t+1].className);
			}
			done = true;
		}
	}
	
	tempDd = null;
}

function reconfigure(e) {
	if (e.storageArea != widget.preferences) return;
	switch(e.key) {
		case 'interval': setRefreshTimer(); break;
	}
}

function setRefreshTimer() {
	clearInterval(slider);
	slider = setInterval(startSlide, 5000);
}

function init() {
	console.log("Initialized");
	console.log("Pair: " + widget.preferences.pairs);
	
	if (!widget.preferences.pairs) {
		var c = ["USD/EUR"];
		widget.preferences.pairs = JSON.stringify(c);
	}
	
	window.addEventListener('storage', reconfigure, false);
	timeIt = setInterval(getData, parseInt(widget.preferences.interval) * 60 * 1000);
	
	getData();
}

document.addEventListener('DOMContentLoaded', init, false);