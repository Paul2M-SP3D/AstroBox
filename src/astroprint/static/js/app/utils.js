/*
 *  (c) Daniel Arroyo. 3DaGoGo, Inc. (daniel@astroprint.com)
 *
 *  Distributed under the GNU Affero General Public License http://www.gnu.org/licenses/agpl.html
 */
 // Load Translation Catalog

 	LOCALE = localeUser;
 	var catalog = window["BABEL_TO_LOAD_" + LOCALE];
 	if (catalog === undefined) {
 			catalog = {messages: undefined, plural_expr: undefined, locale: undefined, domain: undefined}
 	}
 	babel.Translations.load(catalog).install();

	/******************/


var Utils = function() {
	var months = [gettext('Jan'), gettext('Feb'), gettext('Mar'), gettext('Apr'), gettext('May'), gettext('Jun'), gettext('Jul'), gettext('Aug'), gettext('Sep'), gettext('Oct'), gettext('Nov'), gettext('Dec')];

	return {
		timeFormat: function(seconds)
		{
			if (isNaN(seconds)) {
				return '-- : -- : --';
			}

	    	var sec_num = parseInt(seconds, 10); // don't forget the second param
	        var hours   = Math.floor(sec_num / 3600);
	        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	        var seconds = sec_num - (hours * 3600) - (minutes * 60);

	        if (hours   < 10) {hours   = "0"+hours;}
	        if (minutes < 10) {minutes = "0"+minutes;}
	        if (seconds < 10) {seconds = "0"+seconds;}
	        return hours+':'+minutes+':'+seconds;
	    },
	    dateFormat: function(date)
	    {
	    	return months[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
	    },
	    sizeFormat: function(fileSizeInBytes)
	    {
		   	var i = -1;
		    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
		    do {
		        fileSizeInBytes = fileSizeInBytes / 1024;
		        i++;
		    } while (fileSizeInBytes > 1024);

		    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
	    }
	}
};
