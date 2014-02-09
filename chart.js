//comment goes here...

function getActivityArray() {
    var arr = new Array(activityList.list.length+1);
    arr[0] = ['Activity', 'X', 'Y', 'Activity', 'Hours'];
    for(var i=0; i<activityList.list.length; i++){
    	var activity = activityList.list[i];
    	arr[i+1] = new Array(5);
    	arr[i+1][0] = activity.abbrev;
    	arr[i+1][1] = activity.necessity;
    	arr[i+1][2] = -activity.fulfillment;
    	arr[i+1][3] = activity.name;
    	arr[i+1][4] = activity.hours;
   	
    }
    
    return arr;
}

function getPieArray() {
    var arr = new Array(activityList.list.length+1);
    arr[0] = ['Activity', 'Hours'];
	for(var i=0; i<activityList.list.length;i++){
		var activity = activityList.list[i];
    	arr[i+1] = new Array(2);
    	arr[i+1][0] = activity.name;
    	arr[i+1][1] = activity.hours;
    }
    
    return arr;
}

function drawChart(div, bg) {
	var arr = getActivityArray();
	var maxX = 0;
	var maxY = 0;
	for(var i=0; i<activityList.list.length;i++){
		var activity = activityList.list[i];
		var x = Math.abs(activity.necessity);
		var y = Math.abs(activity.fulfillment);
		maxX = Math.max(maxX, x);
		maxY = Math.max(maxY, y);
	}
	
	var data = google.visualization.arrayToDataTable(arr);
	var options = {
			backgroundColor: bg,
			title : 'Activity Analysis',
			hAxis : {
				title : '<<< More Necessary ----- Less Necessary >>>',
				minValue : -maxX-1 ,
				maxValue : maxX+1 ,
				textPosition : "none",
				baselineColor: "red",
				gridlines : {
					count: maxX*2+1
				}
			},
			vAxis : {
				title : '<<< Less Fulfilling ----- More Fulfilling >>>',
				minValue : -maxY - 1,
				maxValue : maxY + 1,
				textPosition : "none",
				baselineColor: "red",
				gridlines : {
					count: maxY*2+1
				}
			},
			bubble : {
				textStyle : {
					fontSize : 11
				}
			},
			height: 450,
			width: 560
		};

		var chart = new google.visualization.BubbleChart(document
				.getElementById(div));
		chart.draw(data, options);
}
function drawChartWindow() {
	var win = window.open("bubble.html?data="+activityList.serialize());
}

function drawReportWindow() {
	var win = window.open("report.html?data="+activityList.serialize());
}

function drawPie(div) {
	var arr = getPieArray();
	var data = google.visualization.arrayToDataTable(arr);

	var options = {
		backgroundColor: "gray",
		title : 'Activies by hours of the week',
		width : 500
	};

	var chart = new google.visualization.PieChart(document
			.getElementById(div));
	chart.draw(data, options);
}

function drawPieSummary(div) {
	var arr = getPieArray();
	var data = google.visualization.arrayToDataTable(arr);

	var options = {
		title : 'Activies by hours of the week',
		width: 300
	};

	var chart = new google.visualization.PieChart(document
			.getElementById(div));
	chart.draw(data, options);
}