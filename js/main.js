/* 
	VARS
===============================================================================================================================
*/

// Constants
const CANVAS = document.getElementById("can").getContext('2d');
const PARENT = document.getElementById("canDiv");
const CURDATEROOT = 'http://date.jsontest.com/';

// Chart Global Config
Chart.defaults.global.defaultFontColor = '#DEDEDE'

// Globals
var _chart;
var _data;
var _options;
var _curDate;
var _curMonth;
var _isLeapYear;
var _nextDays = [];
var _prevDays = [];
var _nextMonths = [];
var _prevMonths = [];
var _dailySubmitData = [];
var _dailyPublishData = [];
var _monthlyPublishData = [];

var months = {
	JAN: 1,
	FEB: 2,
	MAR: 3,
	APR: 4,
	MAY: 5,
	JUN: 6,
	JUL: 7,
	properties: {
		1: {name: "January", value: 1, code: "JAN", days: 31},
		2: {name: "February", value: 2, code: "FEB", days: 28},
		3: {name: "March", value: 3, code: "MAR", days: 31},
		4: {name: "April", value: 4, code: "APR", days: 30},
		5: {name: "May", value: 5, code: "MAY", days: 31},
		6: {name: "June", value: 6, code: "JUN", days: 30},
		7: {name: "July", value: 7, code: "JUL", days: 31}
	}
};



/* 
	INITIALIZATION FUNCTIONS
===============================================================================================================================
*/


function init() {

	sortData('date', true);
	//Get Current Date/Time
	$.ajax({
		url: CURDATEROOT,
		method: 'GET'
	}).then(function(data) {
			var tmp = new Date(data.date);
			//console.log(data.date);
			isLeapYear(tmp);
			_curDate = getFormattedDate(tmp);
			_curMonth = getCurMonth(tmp);

			for(i = 0; i < 6; i++) {
				tmp = getPrevDate(tmp,0);
				var date = getFormattedDate(tmp)
				var result = searchData('date', date);
				_prevDays.unshift(date);

				if(result[0] != null) {
					_dailySubmitData.unshift(result[0].totalPhaseSubmit);
					_dailyPublishData.unshift(result[0].totalPhasePublish);
				} else {
					_dailySubmitData.unshift(0);
					_dailyPublishData.unshift(0);
				}
				
			}
			// Create Chart
			createChart();

		});
		


	
}

init();
/* 
	CHART BUILDER FUNCTIONS
===============================================================================================================================
*/

function createChart() {

	if(_chart != null) {
		_chart.destroy();
	}
	
	// Create Scroll Buttons
	var buttonScrollDataLeft = make(["button", {id:"buttonScrollDataLeft"}, "<"]);
	buttonScrollDataLeft.addEventListener ("click", scrollDataLeft);
	PARENT.appendChild(buttonScrollDataLeft);

	var buttonScrollDataRight = make(["button", {id:"buttonScrollDataRight"}, ">"]);
	buttonScrollDataRight.addEventListener ("click", scrollDataRight);
	PARENT.appendChild(buttonScrollDataRight);


	// Initialize Data
	_data = {
	    labels: _prevDays,
	    datasets: [
	        {
	            label: "Total Phases Submit",
	            backgroundColor: "rgba(93,103,245,0.2)",
	            borderColor: "rgba(93,103,245,1)",
	            borderWidth: 1,
	            tension: 0.0,
	            hoverBackgroundColor: "rgba(93,103,245,0.4)",
	            hoverBorderColor: "rgba(93,103,245,1)",
	            data: _dailySubmitData
	        },
	        {
	            label: "Total Phases Published",
	            backgroundColor: "rgba(98,245,93,0.2)",
	            borderColor: "rgba(98,245,93,1)",
	            borderWidth: 1,
	            tension: 0.0,
	            hoverBackgroundColor: "rgba(98,245,93,0.4)",
	            hoverBorderColor: "rgba(98,245,93,1)",
	            data: _dailyPublishData
	        }
	    ]
	};

	console.log(_data);

	// Initialize Options
	_options = {

	};

	// Initialize Chart
	_chart = new Chart(CANVAS, {
	    type: 'line',
	    data: _data,
	    options: _options
	});
}

/* 
	UI FUNCTIONS
===============================================================================================================================
*/

function scrollDataRight() {

}

function scrollDataLeft() {

}

/* 
	GEN FUNCTIONS
===============================================================================================================================
*/

function getFormattedDate(date) {
	var year = date.getFullYear();
	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;
	return month + '/' + day + '/' + year;
}

// 2nd param is the scale (e.g. 0 = get next day, 1 = get next month, 2 = get next year)
function getNextDate(date, mode) {
	var dateString;
	if(mode === 0) {
		if(getDaysLeft(date) > 0) {
			var retString;
			var year = date.getFullYear();
			var month = (1 + date.getMonth()).toString();
			month = month.length > 1 ? month : '0' + month;
			var day = date.getDate();
			day++;
			day = day.toString();
			day = day.length > 1 ? day : '0' + day;
			dateString = month + '-' + day + '-' + year;
			var tmp = new Date(dateString);
			return tmp;
		}
		// Error no more days in this month
		//console.log("Error: no more days in this month");
		return;
	}
	// TO DO: Add Month mode

	// Error invalid mode
	//console.log("Error: invalid mode");
	return;
}

function getPrevDate(date, mode) {
	var dateString;
	if(mode === 0) {
		if(getDaysLeft(date) < months.properties[_curMonth].days-1) {
			var retString;
			var year = date.getFullYear();
			var month = (1 + date.getMonth()).toString();
			month = month.length > 1 ? month : '0' + month;
			var day = date.getDate();
			day--;
			day = day.toString();
			day = day.length > 1 ? day : '0' + day;
			dateString = month + '-' + day + '-' + year;
			var tmp = new Date(dateString);

			return tmp;
		}
		// Error no more days in this month
		//console.log("Error: no more days in this month");
		return;
	}
	// TO DO: Add Month mode

	// Error invalid mode
	//console.log("Error: invalid mode");
	return;
}

function isLeapYear(date) {
	var year = date.getFullYear();
	if(year%4 === 0) {
		_isLeapYear = true;
	}
	else {
		_isLeapYear = false;
	}
}

function getDaysLeft(date) {
	var day = date.getDate();
	//console.log(getMonthDays() - day);
	return getMonthDays() - day;
}

function getMonthDays() {
	return months.properties[_curMonth].days;
}

function getCurMonth(date) {
	var ret;
	var month = 1 + date.getMonth();
	switch (month) {
    case 1:
        ret = months.JAN;
        break;
    case 2:
    	ret = _isLeapYear ? (months.FEB.days.value+1) : months.FEB.days.value;
        break;
    case 3:
        ret = months.MAR;
        break;
    case 4:
        ret = months.APR;
        break;
    case 5:
        ret = months.MAY;
        break;
    case 6:
        ret = months.JUN;
        break;
    case 7:
        ret = months.JUL;
        break;
	}
	//console.log(ret);
	return ret;
}

function sortData(prop, asc) {
	if(prop === "date") {
		if(asc) {
			_phaseData.sort(sortDatesAsc);
		} else {
			_phaseData.sort(sortDatesDes);
		}
	}
	// TO DO: Add sort by publishCount and sort by submitCount
}

function sortDatesAsc(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function sortDatesDes(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
}

// Finds First Occurance
function searchData(prop, value) {
	var result = _phaseData.filter(
		function (record) {
			return record[prop] == value;
		}
	);
	return result
}






