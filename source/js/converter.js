/*  This file is part of Instant Currency Rates. Instant Currency Rates
	is an Opera extension that lets you view updates to the latest 
	currency exchange rates in an Opera Speed Dial.
	
    Copyright (C) 2012 - 2013 M Shabeer Ali

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
	Website: http://currencyrate.tumblr.com/
	Source code: https://github.com/thewebdev/opera-extension-icr.git 
	Email: thewebdev@myopera.com */
	
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

function submit() {
	return false;
}

function rateUpdate() {
	var amount, first, li, id, marked;
	
	amount = document.input.money.value;
	first = document.input.first.value;
	
	/* update heading */	
	$('convert').firstChild.nodeValue = amount + ' ' + currency[first] + ' = ';
	
	amount = parseInt(amount, 10);
	
	if ((!amount) && (amount !== 0)) { 
		/* Validation - should be a number */
		status("Error: Enter a number as currency value.");
		return;
	} else {
		document.input.money.value = amount;
	}
	
	if (amount <= 0) {
		/* Validation - amount cannot be less than 1 */
		status("Error: Enter a number greater than 0.");
		return;			
	}
	
	/* get all list nodes */
	li = $("set").getElementsByTagName('li');
	
	if (li) {
		
		/* get id of each node in the list
		   and use that to update the node
		   with new conversion values;
		   remove any node where first and
		   second currency are the same */
		   
		for (var i = 0; i < li.length; i++) {
			id = li[i].getAttribute('id');
			if (first == id) { 
				temp = 1 + ' ' + currency[id];
				$(id).lastChild.nodeValue = temp;
				continue;
			}
			temp = convert(amount, first, id);
			temp = temp + ' ' + currency[id];
			$(id).lastChild.nodeValue = temp;
		}
	}
	
	/* Enable save button as user
	   may have made changes to 
	   first currency, but not if
	   there is no currency to be 
	   saved (indicated by count). */
	   
	if (count === 0) {
		$('apply').disabled = true;
	} else {
		$('apply').disabled = false;
	}	
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

function apply() {
	/* Saves the changes; does
	   some validation too. */
	   
	var val, ul, li;
	
	/* save / delete list nodes by id */
	for (var id in stack) {
		if (stack[id][0] == 'add'){
			val = stack[id][1];
			if (localStorage) {
				localStorage.setItem(id, val);
			} else {
				status("Error: Unable to save.");
			}
		}
		
		if (stack[id][0] == 'remove') {
			if (localStorage.getItem(id)) {
				localStorage.removeItem(id);
			}
		}
	}
	
	/* reset stack */
	stack = {};
	
	hide("set");
	ul = $("set");
	li = ul.getElementsByTagName("li");
	
	/* remove class name to flag that
	   new notes have been saved */
	   
	for (var e = 0; e < li.length; e++) {
		li[e].className = "";
	}
	
	show("set");
	
	/* save first currency in 
	   widget preferences rather
	   than localstorage as it 
	   makes the code less complex */
	   
	first = document.input.first.value;
	widget.preferences.first = first;
	
	$('apply').disabled = true;
	return;
}

function remove(id) {
	/* Allows user to delete a currency
	   Note: The currency is not deleted 
	   from localstorage immediately. */
	   
	var li;
	
	/* when the user clicks 'delete'
	   a click event will occur, else
	   id.type will be null indicating
	   that id is not an event but
	   a string. If id is a string
	   we can use it as such to identify
	   the node to delete, otherwise
	   we use dom events to identify node. */
	   
	if(id.type) {
		id = this.parentNode.id;
	}

	li = $(id);

	/* makes sure we don't delete currency
	   that is not saved in localStorage. */
	
	if (li.className == 'new') {
		/* delete from stack only */
		delete stack[id];
	} else {
		/* mark for deletion */
		stack[id] = ['remove'];
	}
	
	count = count - 1;

	/* Validation: there should be atleast one
   currency to save in localStorage */
   
	if (count === 0) {
		$('apply').disabled = true;
	} else {
		$('apply').disabled = false;
	}
	
	li.parentNode.removeChild(li);
}

function add() {
	/* Does the currency conversion 
	   and displays it in the list. 
	   Also does some validations 
	   of user input. */
	   
	var temp, amount, first, second;
	var li, id, a, txt;
	
	amount = document.input.money.value;
	first = document.input.first.value;
	second = document.input.second.value;
	
	amount = parseInt(amount, 10);
	
	if ((!amount) && (amount !== 0)) { 
		/* Validation - should be a number */
		status("Error: Enter a number as currency value.");
		return;
	} else {
		document.input.money.value = amount;
	}
	
	if (amount <= 0) {
		/* Validation - amount cannot be less than 1 */
		status("Error: Enter a number greater than 0.");
		return;			
	}	
	
	if (first === second) {
		/* Validation - source / target currrency can't be same */
		status("Error: Same currency selected.");
		return;
	}
		
	id = second;
	
	/* Validation - user shouldn't add a currency twice */
	
	if (stack[id]) {
		/* Check the stack first -
		   The stack holds the currency that 
		   the user wants to add or remove. */ 
		if (stack[id][0] == 'add') {
			status('Error: ' + id + ' already added to list.');
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
	a.addEventListener('click', remove, false);

	temp = convert(amount, first, second);
	temp = temp + ' ' + currency[second];
				
	txt = Txt(temp);
	
	li.appendChild(a);
	li.appendChild(txt);
	
	/* mark it in stack */
	stack[id] = ["add", currency[second]];
	count += 1;
		
	$("set").appendChild(li);
	
	/* Enable the save button as
	   user made changes. */
	$('apply').disabled = false;
	
	return;
}

function convert(amount, first, second) {
	/* code reuse - refer to background.js */
	
	var rates, value;
	
	rates = opera.extension.bgProcess.getRates();
	
	if (rates) {
		if (first == "USD") {
			value =  amount * rates[second][0];
		} else {
			value =  amount * (1/rates[first][0]);
		}
		
		if ((first != "USD") && (second != "USD")) {
			value =  amount * (rates[second][0]/rates[first][0]);
		}
		
		value = opera.extension.bgProcess.trueRound(value);
		return value;
	} else {
		status("Error: Couldn't get latest currency rates update.");
	}
}

function load() {
	/* Loads the current preferences and
	   displays it to the user for making
	   changes. */ 
	   
	var temp, first, amount;
	var key, val;
	var li, a, txt;
	var inHtml = document.createDocumentFragment();
	
	hide("set");
	
	if (widget.preferences.first) {
		first = widget.preferences.first;
	} else {
		first = document.input.first.value;
	}
	
	amount = document.input.money.value;
	
	$('convert').firstChild.nodeValue = amount + ' ' + currency[first] + ' = ';
	
	/* Creates a ul list to display 
	   the saved currencies */
	
	if (localStorage) {
		if (localStorage.length) {   
			for (var i = 0; i < count; i++) {
			/*  Each list element also has a delete
				link so that the user can delete a
				currency. Note: Clicking delete
				does not delete it immediately. */
				
				key = localStorage.key(i);
				val = String(localStorage.getItem(key));
				
				li = E("li");
				li.setAttribute('id', key);
				
				a = E("a");
				a.setAttribute('href', '#self' + i);
				txt = Txt('delete');
				a.appendChild(txt);
				a.addEventListener('click', remove, false);
				
				temp = convert(amount, first, key);
				temp = temp + ' ' + val;
				
				txt = Txt(temp);				
				li.appendChild(a);
				li.appendChild(txt);
				
				inHtml.appendChild(li);
			}
		}
	}

	$("set").appendChild(inHtml);
	show("set");
}

function init() {
	/* some basic settings intialised here */
	
	if (localStorage) {
		if (localStorage.length) {
			count = localStorage.length;
		}
	}
	
	/* disable save button on start */
	$('apply').disabled = true;
	
	/* monitor button clicks */
	$('first').addEventListener('change', rateUpdate, false);
	$('add').addEventListener('click', add, false); 
	$('apply').addEventListener('click', apply, false);
	
	/* monitor data entry */
	$('money').addEventListener('keyup', rateUpdate, false);
	
	/* to catch form reload on ENTER key press */
	$('input').addEventListener('submit', submit, false);	
	
	load();
}

/*  monitor and inform when HTML file is ready */
document.addEventListener('DOMContentLoaded', init, false);
