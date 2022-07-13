/**
*
*/
// 100000000.123 -> 100,000,000.123
function addThousandSeparatorCommas (num) {
	if (num == null || num == '') {
		return '0';
	}

	var parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	return parts.join('.');
}

// ex) range(4)			-> [0, 1, 2, 3]
// ex) range(1, 5)		-> [1, 2, 3, 4]
// ex) range(0, 20, 5)	-> [0, 5, 10, 15]
// ex) range(0, -4, -1)	-> [0, -1, -2, -3]
// ex) range(1, 4, 0)	-> [1, 1, 1]
// ex) range(0)			-> []
function range(start, end, step) {
	if (arguments.length === 1) {
		end = start;
		start = 0;
		step = 1;
	}
	else if (arguments.length === 2) {
		step = 1;
	}

	if (end === 0) {
		return [];
	}

	var arr = [];
	for (var i = start; i < end; i += step) {
		arr.push(i);
	}
	return arr;
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function getData(obj) {
    var result = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
        	result[key] = obj[key];
        }
    }

    return result;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    var domains = "path=/";
    document.cookie = cname + "=" + cvalue + "; " + expires + "; " + domains;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

function encodeTagStr (str) {
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        ;
}
function decodeTagStr (str) {
    return str
        .replace(/\&lt\;/g, '<')
        .replace(/\&gt\;/g, '>')
        .replace(/\&quot\;/g, '"')
        ;
}
