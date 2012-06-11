﻿var pairs = widget.preferences.pairs;
var interval = widget.preferences.interval;
var max = widget.preferences.maxpairs;
var stack = {};
var count;

var currency = {
	"EUR": "Euro",
	"GBP": "British Pound",
	"USD": "United States Dollar",
	"AUD": "Australian Dollar",
	"CAD": "Canadian Dollar",
	"CHF": "Swiss Franc",
	"CNY": "Chinese Yuan",
	"HKD": "Hong Kong Dollar",
	"IDR": "Indonesian Rupiah",
	"INR": "Indian Rupee",
	"JPY": "Japanese Yen",
	"THB": "Thai Baht",
	"ALL": "Albanian Lek",
	"DZD": "Algerian Dinar",
	"XAL": "Aluminium Ounces",
	"ARS": "Argentine Peso",
	"AWG": "Aruba Florin",
	"BSD": "Bahamian Dollar",
	"BHD": "Bahraini Dinar",
	"BDT": "Bangladesh Taka",
	"BBD": "Barbados Dollar",
	"BYR": "Belarus Ruble",
	"BZD": "Belize Dollar",
	"BMD": "Bermuda Dollar",
	"BTN": "Bhutan Ngultrum",
	"BOB": "Bolivian Boliviano",
	"BWP": "Botswana Pula",
	"BRL": "Brazilian Real",
	"BND": "Brunei Dollar",
	"BGN": "Bulgarian Lev",
	"BIF": "Burundi Franc",
	"KHR": "Cambodia Riel",
	"CVE": "Cape Verde Escudo",
	"KYD": "Cayman Islands Dollar",
	"XOF": "CFA Franc (BCEAO)",
	"XAF": "CFA Franc (BEAC)",
	"CLP": "Chilean Peso",
	"COP": "Colombian Peso",
	"KMF": "Comoros Franc",
	"XCP": "Copper Pounds",
	"CRC": "Costa Rica Colon",
	"HRK": "Croatian Kuna",
	"CUP": "Cuban Peso",
	"CZK": "Czech Koruna",
	"DKK": "Danish Krone",
	"DJF": "Dijibouti Franc",
	"DOP": "Dominican Peso",
	"XCD": "East Caribbean Dollar",
	"ECS": "Ecuador Sucre",
	"EGP": "Egyptian Pound",
	"SVC": "El Salvador Colon",
	"ERN": "Eritrea Nakfa",
	"EEK": "Estonian Kroon",
	"ETB": "Ethiopian Birr",
	"FKP": "Falkland Islands Pound",
	"FJD": "Fiji Dollar",
	"GMD": "Gambian Dalasi",
	"GHC": "Ghanian Cedi",
	"GIP": "Gibraltar Pound",
	"XAU": "Gold Ounces",
	"GTQ": "Guatemala Quetzal",
	"GNF": "Guinea Franc",
	"GYD": "Guyana Dollar",
	"HTG": "Haiti Gourde",
	"HNL": "Honduras Lempira",
	"HUF": "Hungarian Forint",
	"ISK": "Iceland Krona",
	"IRR": "Iran Rial",
	"IQD": "Iraqi Dinar",
	"ILS": "Israeli Shekel",
	"JMD": "Jamaican Dollar",
	"JOD": "Jordanian Dinar",
	"KZT": "Kazakhstan Tenge",
	"KES": "Kenyan Shilling",
	"KRW": "South Korean Won",
	"KWD": "Kuwaiti Dinar",
	"LAK": "Lao Kip",
	"LVL": "Latvian Lat",
	"LBP": "Lebanese Pound",
	"LSL": "Lesotho Loti",
	"LRD": "Liberian Dollar",
	"LYD": "Libyan Dinar",
	"LTL": "Lithuanian Lita",
	"MOP": "Macau Pataca",
	"MKD": "Macedonian Denar",
	"MWK": "Malawi Kwacha",
	"MYR": "Malaysian Ringgit",
	"MVR": "Maldives Rufiyaa",
	"MTL": "Maltese Lira",
	"MRO": "Mauritania Ougulya",
	"MUR": "Mauritius Rupee",
	"MXN": "Mexican Peso",
	"MDL": "Moldovan Leu",
	"MNT": "Mongolian Tugrik",
	"MAD": "Moroccan Dirham",
	"MMK": "Myanmar Kyat",
	"NAD": "Namibian Dollar",
	"NPR": "Nepalese Rupee",
	"ANG": "Neth Antilles Guilder",
	"TRY": "Turkish Lira",
	"NZD": "New Zealand Dollar",
	"NIO": "Nicaragua Cordoba",
	"NGN": "Nigerian Naira",
	"KPW": "North Korean Won",
	"NOK": "Norwegian Krone",
	"OMR": "Omani Rial",
	"XPF": "Pacific Franc",
	"PKR": "Pakistani Rupee",
	"XPD": "Palladium Ounces",
	"PAB": "Panama Balboa",
	"PGK": "Papua New Guinea Kina",
	"PYG": "Paraguayan Guarani",
	"PEN": "Peruvian Nuevo Sol",
	"PHP": "Philippine Peso",
	"XPT": "Platinum Ounces",
	"PLN": "Polish Zloty",
	"QAR": "Qatar Rial",
	"RON": "Romanian New Leu",
	"RUB": "Russian Rouble",
	"RWF": "Rwanda Franc",
	"WST": "Samoa Tala",
	"STD": "Sao Tome Dobra",
	"SAR": "Saudi Arabian Riyal",
	"SCR": "Seychelles Rupee",
	"SLL": "Sierra Leone Leone",
	"XAG": "Silver Ounces",
	"SGD": "Singapore Dollar",
	"SKK": "Slovak Koruna",
	"SIT": "Slovenian Tolar",
	"SBD": "Solomon Islands Dollar",
	"SOS": "Somali Shilling",
	"ZAR": "South African Rand",
	"LKR": "Sri Lanka Rupee",
	"SHP": "St Helena Pound",
	"SDG": "Sudanese Pound",
	"SZL": "Swaziland Lilageni",
	"SEK": "Swedish Krona",
	"SYP": "Syrian Pound",
	"TWD": "Taiwan Dollar",
	"TZS": "Tanzanian Shilling",
	"TOP": "Tonga Pa'ang",
	"TTD": "Trinidad & Tobago Dollar",
	"TND": "Tunisian Dinar",
	"AED": "UAE Dirham",
	"UGX": "Ugandan Shilling",
	"UAH": "Ukraine Hryvnia",
	"UYU": "Uruguayan New Peso",
	"VUV": "Vanuatu Vatu",
	"VEF": "Venezuelan Bolivar Fuerte",
	"VND": "Vietnam Dong",
	"YER": "Yemen Riyal",
	"ZMK": "Zambian Kwacha",
	"ZWD": "Zimbabwe dollar"
};	

function $(v) {
	if (document.getElementById(v)) {
		return document.getElementById(v);
	}
}

function hide(id) {
	$(id).style.display = 'none';
}

function show(id) {
	$(id).style.display = 'block';
}

function E(v) {
	return document.createElement(v);
}

function Txt(v) {
	return document.createTextNode(v);
}	

function status(msg) {
	/* Used to display messages
	   to the user */
	   
	var hangTimer;
	
	$("msg").firstChild.nodeValue = msg;
	show("msg");
	
	/* show status update for 7 seconds */
	clearTimeout(hangTimer);
	hangTimer = setTimeout(function() {
		hide("msg");
	}, 7000);	
}

function unlock() {
	/* Enable save button as user
	   may have made changes to 
	   interval value, but not if
	   there is no currency pairs
	   to be saved (indicated by 
	   count). */
	   
	if (count === 0) {
		$('apply').disabled = true;
	} else {
		$('apply').disabled = false;
	}
}

function apply() {
	/* Saves the changes to 
	   widget preferences; does
	   some validation too. */
	   
	var cmd, i, temp;
	var ul, li;
	var save = false;
	
	i = document.input.interval.value;
	i = parseInt(i, 10);		

	if (!i) { 
		/* Validation - interval should be a number */
		status("Error: Update interval should be a number");
		return;
	} else {
		document.input.interval.value = i;
	}
	
	if (i < 15) {
		/* Validation - interval cannot be less than 15 */
		status("Error: Update interval should be more than 15 minutes.");
		return;			
	}
	
	for (var id in stack) {
	
		temp = pairs.indexOf(id);
		
		/* Validation: check if pair is already
           stored in preferences */
		   
		if (stack[id] == 'add'){
			if (temp != -1) {
				stack[id] = 'nochange';
			} else {		
				pairs[pairs.length] = id;
				save = true;
			}				
		}
		
		if (stack[id] == 'remove') {
			if (temp != -1) {
				pairs.splice(temp, 1);				
				save = true;
			}	
		}
	}
	
	/* store the changes in currency pair */
	if (save) {		
		widget.preferences.pairs = JSON.stringify(pairs);
	}

	/* store the change in interval value */
	if (i != interval) {
		widget.preferences.interval = i;
	}	
	
	stack = {};
	
	hide("set");

	ul = $("set");
	li = ul.getElementsByTagName("li");
	
	/* remove class name to flag that
	   pairs have been saved */
	for (var e = 0; e < li.length; e++) {
		li[e].className = "";
	}
	
	show("set");
	
	if (save) {
		/* reload dial with new settings */
		opera.extension.bgProcess.getData();		
	}
	
	return;
}

function removePair() {
	/* Allows user to delete a currency
	   pair from the preferences. Note:
	   The currency pairs are not deleted from 
	   the widget prerences immediately.*/
	   
	var id, li;
	var temp;
	
	id = this.parentNode.id;
	
	li = $(id);

	/* makes sure we don't delete a pair
	   that is not saved in preferences. */
	
	if (li.className == 'new') {
		/* delete from stack only */
		delete stack[id];
		console.log("deleted from stack");
	} else {
		/* mark for deletion */
		stack[id] = 'remove';
		console.log("marked for deletion");
	}
	
	count = count - 1;

	/* Validation: there should be atleast one
   currency pair to save in preferences */
	if (count == 0) {
		$('apply').disabled = true;
	} else {
		$('apply').disabled = false;
	}
	
	li.parentNode.removeChild(li);
}

function addPair() {
	/* Allows the user to add new 
	   currency pairs and displays
	   it in the list. Also does some 
	   validations of user input. */
	   
	var temp, first, second;
	var li, id, a, txt;
	
	if (count == max) {
		/* validation - 5+ pair not allowed */
		status("Error: Maximum limit of " + max + " pairs reached.");
		return;	
	}
	
	first = document.input.first.value;
	second = document.input.second.value;
	
	if (first === second) {
		/* Validation - source / target currrency can't be same */
		status("Error: Same currency selected.");
		return;
	}
		
	id = first + "/" + second;
	
	/* Validation - user shouldn't add a currency pair twice */
	
	if (stack[id]) {
		/* 1. Check the stack first -
		   The stack holds the pairs that 
		   the user wants to add or remove. */
		   
		if (stack['id'] == 'add') {
			status('Error: Duplicate pair not added - ' + id);
			return;
		}
	}
	
	if (pairs.indexOf(id) != -1) {
	/*  2. Check the widget preferences
           and also make sure that 
		   the pair is not marked for
		   removal. */
		   
		if (!(stack['id'] == 'remove')) {
			status('Error: Duplicate pair not added - ' + id);
			return;
		}
	}
	
	li = E("li");
	li.setAttribute('id', id);
	li.className = "new";
	
	a = E("a");
	a.setAttribute('href', '#self');
	txt = Txt('delete');
	a.appendChild(txt);
	a.addEventListener('click', removePair, false);
	
	txt = first;
	txt += " / " + second;
	txt += " (" + currency[first];
	txt	+= " / " + currency[second] + ")";
	txt = Txt(txt);
	
	li.appendChild(a);
	li.appendChild(txt);
	
	/* if a pair saved in preferences
	   was to be deleted, and that 
	   same pair has been added again 
	   undo the remove command. */
	
	if (stack[id]) {
		delete stack[id];
	} else {
		stack[id] = "add"
	}
	
	count += 1;
		
	$("set").appendChild(li);
	
	/* Enable the save button as
	   user made changes. */
	$('apply').disabled = false;
	
	return;
}

function load() {
	/* Loads the current preferences and
	   displays it to the user for making
	   changes. */ 
	   
	var temp, first, second;
	
	var ul, li, a, txt;
	var inHtml = document.createDocumentFragment();

	hide("set");
	
	/* Creates a ul list to display 
	   the currency pairs that is stored
	   in the preferences. */
	   
	for (var i = 0; i < count; i++) {
	/*  Each list element also has a delete
	    link so that the user can delete a
		currency pair. Note: Clicking delete
		does not delete the currency pair 
		from widget preferences immediately. */
		
		li = E("li");
		
		a = E("a");
		a.setAttribute('href', '#self' + i);
		txt = Txt('delete');
		a.appendChild(txt);
		a.addEventListener('click', removePair, false);
		
		temp = pairs[i];
		temp = temp.split('/');
		
		first = temp[0];
		second = temp[1];
		
		li.setAttribute('id', first + "/" + second);
		
		txt = first;
		txt += " / " + second;
		txt += " (" + currency[first];
		txt	+= " / " + currency[second] + ")";
			
		txt = Txt(txt);
		
		li.appendChild(a);
		li.appendChild(txt);
		
		inHtml.appendChild(li);
	}
	
	$("set").appendChild(inHtml);
	show("set");
	
	document.input.interval.value = interval;
}

function init() {
	/* some basic settings intialised here */
	
	pairs = JSON.parse(pairs);
	count = pairs.length;
	interval = parseInt(interval, 10);
	
	/* disable save button on start */
	$('apply').disabled = true;
	
	/* monitor for button clicks */
	$('addpair').addEventListener('click', addPair, false); 
	$('apply').addEventListener('click', apply, false);
	
	/* monitor textbox for changes */
	$('interval').addEventListener('keypress', unlock ,false);
	
	load();
}

/*  monitor and inform when HTML file is ready */
document.addEventListener('DOMContentLoaded', init, false);