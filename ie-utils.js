// quick and dirty IE-specific code to make life easier
// I realize I'm extending native objects, but IE deserves it.

if(!window.addEventListener)
{
	window.addEventListener = function(eventName,callback) {
		window.attachEvent("on"+eventName,callback);
	};
}

if(!document.defaultView)
{
	document.defaultView = {
		getComputedStyle : function(elem) {
			return elem.currentStyle;
		}
	};
}
