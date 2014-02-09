var activityList = new ActivityList();
var initStr = "";
var activityForm;

function Activity() {
    this.id = 0;
    this.name = "";
    this.abbrev = "";
    this.hours = 0;
    this.necessity = 0;
    this.fulfillment = 0;
}

function initFromStorage() {
	var pList = JSON.parse(localStorage.bubbleChart);
	for(var i=0; i < pList.list.length; i++) {
		var pAct = pList.list[i];
		var activity = activityList.addActivity(pAct.name, pAct.hours);
        activity.fulfillment = pAct.fulfillment;
        activity.necessity = pAct.necessity;
	}
}


Activity.prototype.setName = function(name) {
    this.name = name;
    this.abbrev = generateAbbreviation(this.abbrev, this.name);
};

Activity.prototype.set = function(field, val) {
    if (field == "necessity") this.necessity = val;
    else if (field == "fulfillment") this.fulfillment = val;
};

Activity.prototype.get = function(field) {
    if (field == "necessity") return this.necessity;
    if (field == "fulfillment") return this.fulfillment;
    return 0;
};

function generateAbbreviation(abbrev, name) {
    if (abbrev !== "") return abbrev;
    return (name.length > 4) ? name.substring(0,4) : name;
}

function ActivityList() {
    this.count = 0;
    this.list = new Array(0);
}

ActivityList.prototype.add = function(activity) {
    this.count ++;
    this.list.push(activity);
    activity.id = this.count;
    this.save();
};

ActivityList.prototype.remove = function(activity) {
    var i = this.list.indexOf(activity);
    if (i > -1) this.list.splice(i,1);
    this.save();
};

ActivityList.prototype.addInitialItem = function(name, hours) {
    var activity = new Activity();
    activity.setName(name);
    activity.hours = hours;
    this.add(activity);
};

ActivityList.prototype.addActivity = function(name, hours) {
    var activity = new Activity();
    activity.setName(name);
    activity.hours = Number(hours);
    this.add(activity);
    this.save();
    return activity;
};

ActivityList.prototype.save = function() {
    localStorage.bubbleChart = JSON.stringify(this);
};

ActivityList.prototype.findItem = function(id) {
    for(var i=0; i<this.list.length; i++){
        var activity = this.list[i];
        if (activity.id == id) return activity;
    }
    return null;
};

ActivityList.prototype.drawTable = function(summary) {
    var t = summary ? $('<table id="summact"/>') : $('<table id="activities" class="ui-widget ui-widget-content"/>');
    var th = $('<thead/>');
    var tb = $('<tbody/>');
    t.append(th).append(tb);
    var trclass = summary ? "" : "ui-widget-header";
    var tr = $('<tr class="'+trclass+'">');
    tr.append('<th width="60%">Activity Name</th>');
    var lab = summary ? "hr/wk" : "Hours per week";
    tr.append('<th width="15%">'+lab+'</th>');
    if (!summary) {
        tr.append('<th width="10%">Edit</th>');
    }
    th.append(tr);

    var total = 0;
    for(var i=0; i<this.list.length; i++){
       var activity = this.list[i];
       total += activity.hours;
       tr = $('<tr class="myact"/>');
       tr.append("<td>"+activity.name+'</td>');
       tr.append("<td>"+activity.hours+'</td>');
       if (!summary) {
           tr.append('<td><input name="sel" type="radio"/></td>');
       }
       tb.append(tr);
       var sel = tr.find("input[name=sel]");
       sel.val(activity.id).click(function() {activityForm.itemSel($(this).val())});
       var f = function(){
           var sel = $(this).find("input[name=sel]");
           sel.attr("checked",true);
           activityForm.itemSel(sel.val());
       };
       tr.click(f);
    }
    tr = $('<tr class="'+trclass+'">');
    tr.append('<th width="60%">Total Hours</th>');
    tr.append('<th width="15%">'+total+'</th>');
    if (!summary) {
        tr.append('<th width="10%"></th>');
    }
    tb.append(tr);
    if (summary) {
        $("#act-summary").html(t);
        drawPieSummary('pie-summary');
    } else {
        $("#act-table").html(t);
        $("#remove-activity, #edit-activity").hide();
        if (this.list.length > 0) {
            $("#h1a,#h2,#h3,#h4,#h5").show();
            drawPie('actchart');
            this.drawImportTable();
            this.drawFulfillmentTable();
            if (this.checkNeutral()) {
                drawChart("chart_div", "gray");
            }
        }

    }
};

ActivityList.prototype.drawRankRow = function(tb, activity, cl) {
       var tr = $('<tr class="myact '+cl+'"/>');
       tr.append("<td width='75%'>"+activity.name+'</td>');
       var td = $("<td/>");
       tr.append(td);
       td.append('<input type="hidden" name="id" value="' + activity.id + '"/>');
       td.append('<a onclick="javascript:rankTop(this)"><span style="float:left" class="ui-icon ui-icon-arrowstop-1-n"></span></a>');
       td.append('<a onclick="javascript:rankUp(this)"><span style="float:left" class="ui-icon ui-icon-arrow-1-n"></span></a>');
       td.append('<a onclick="javascript:rankDown(this)"><span style="float:left" class="ui-icon ui-icon-arrow-1-s"></span></a>');
       td.append('<a onclick="javascript:rankBottom(this)"><span style="float:left" class="ui-icon ui-icon-arrowstop-1-s"></span></a>');
       tb.append(tr);
};

ActivityList.prototype.drawRankTable = function(tableId, field, topHeader, bottomHeader) {
    function compare(a, b) {
        if (a.get(field) < b.get(field)) return -1;
        if (a.get(field) > b.get(field)) return 1;
        return 0;
    }

    var hasNeutral = false;
    this.list.sort(compare);

    var t = $('<table class="ui-widget ui-widget-content">');
    var tb = $('<tbody/>');
    t.append(tb);
    var tr1 = $('<tr class="rank-top ui-widget-header ">');
    tr1.append('<th colspan="2">'+topHeader+'</th>');
    tb.append(tr1);

    for(var i=0; i<this.list.length; i++){
           var activity = this.list[i];
           if (activity.get(field) < 0) {
               this.drawRankRow(tb, activity, "myact-r");
           }
    }

    var tr2 = $('<tr class="rank-neutral ui-widget-header ">');
    tr2.append('<th colspan="2">Neutral Activities (Move all items from this section)</th>');
    tb.append(tr2);

    for(var i=0; i<this.list.length; i++){
           var activity = this.list[i];
           if (activity.get(field) === 0) {
               this.drawRankRow(tb, activity, "neutral");
               hasNeutral = true;
           }
    }

    var tr3 = $('<tr class="rank-bottom ui-widget-header ">');
    tr3.append('<th colspan="2">' + bottomHeader + '</th>');
    tb.append(tr3);

    for(var i=0; i<this.list.length; i++){
           var activity = this.list[i];
           if (activity.get(field) > 0) {
               this.drawRankRow(tb, activity, "myact-r");
           }
    }


    $(document).find(tableId).html(t);
    return hasNeutral;
};

ActivityList.prototype.drawImportTable = function() {
    return this.drawRankTable(
            "#necess-table",
            "necessity",
            "Necessary Activities (most necessary at the top)",
            "Unnecessary Activities (least necessary at the bottom)");
};

ActivityList.prototype.drawFulfillmentTable = function() {
    return this.drawRankTable(
            "#fulfill-table",
            "fulfillment",
            "Fulfilling Activities (most fulfilling at the top)",
            "Unfulfilling Activities (least fulfilling at the bottom)");
};

ActivityList.prototype.checkNeutral = function() {
    var bNecessity = false;
    var bFulfill = false;
    for(var i=0; i<this.list.length; i++) {
        if (this.list[i].necessity === 0) bNecessity = true;
        if (this.list[i].fulfillment === 0) bFulfill = true;
    }
    var s = "";
    if (bNecessity) s += "Please rank each activity as necessary or unnecessary.  ";
    if (bFulfill) s +=  "Please rank each activity as fulfilling or unfulfilling.";
    if (bNecessity || bFulfill) {
        $("#chart_div").text(s);
        $("#ie").hide();
        $("#h5").hide();
        return false;
    }
    $("#h5").show();
    $("#ie").show();
    return true;
};

ActivityList.prototype.serialize = function() {
    var s = "";
    for(var i=0; i<this.list.length; i++){
           var activity = this.list[i];
           s += escape(activity.name) + ";;" + activity.abbrev + ";;"+activity.hours+";;"+activity.necessity+";;"+activity.fulfillment+";;";
    }
    return s;
};