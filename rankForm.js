var activityList;
var rankDelay = 500;

function rankGetRow(n) {
	return $(n).parents("tr");
}

function rankGetTable(n) {
	return $(n).parents("table");
}

function rankGetTop(n) {
	return rankGetTable(n).find("tr.rank-top");
}

function rankGetNeutral(n) {
	return rankGetTable(n).find("tr.rank-neutral");
}

function rankGetBottom(n) {
	return rankGetTable(n).find("tr.rank-bottom");
}

function rankTop(n) {
	var r = rankGetRow(n);
	r.fadeOut(rankDelay, function() {
		r.insertAfter(rankGetTop(n));
		r.addClass("myact-r");
		r.removeClass("neutral");
		updateRank(n);
		$(this).fadeIn(rankDelay);
	}
	);
}

function rankUp(n) {
	var r = rankGetRow(n);
	var p = r.prevAll("tr.myact-r, tr.rank-neutral").first();
	r.fadeOut(rankDelay, function() {
		r.insertBefore(p);
		r.addClass("myact-r");
		r.removeClass("neutral");
		updateRank(n);
		$(this).fadeIn(rankDelay);
	}
	);
}

function rankDown(n) {
	var r = rankGetRow(n);
	var x = r.nextAll("tr.myact-r, tr.rank-bottom").first();
	r.fadeOut(rankDelay, function() {
		r.insertAfter(x);
		r.addClass("myact-r");
		r.removeClass("neutral");
		updateRank(n);
		$(this).fadeIn(rankDelay);
		}
	);
}

function rankBottom(n) {
	var r = rankGetRow(n);
	r.fadeOut(rankDelay, function() {
		rankGetTable(n).append(rankGetRow(n));
		r.addClass("myact-r");
		r.removeClass("neutral");
		updateRank(n);
		$(this).fadeIn(rankDelay);
	}
	);
}

function getFieldForTable(n) {
	if ($(n).parents("#necess-table").is("div"))
		return "necessity";
	else if ($(n).parents("#fulfill-table").is("div"))
		return "fulfillment";
	return "";
}

function updateRank(n) {
	var field = getFieldForTable(n);
	var neut = rankGetNeutral(n);
	neut.prevAll().each(function(i) {
		var id = $(this).find("input[name=id]").val();
		var activity = activityList.findItem(id);
		if (activity !== null) {
			activity.set(field, -i-1);
		}
	});
	var bott = rankGetBottom(n);
	bott.nextAll().each(function(i) {
		var id = $(this).find("input[name=id]").val();
		var activity = activityList.findItem(id);
		if (activity !== null) {
			activity.set(field, i+1);
		}
	});
	
	activityList.save();
	if (activityList.checkNeutral()) drawChart("chart_div","gray");
}

