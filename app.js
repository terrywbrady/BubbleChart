var activityForm = new ActivityForm();
var initFromStorage;
var drawChartWindow;
var drawReportWindow;
var activityList;

$(document).ready(function() {
    initFromStorage();

    activityList.drawTable(false);
    $("#tabs").accordion({
        autoHeight: false,
        change : function(event, ui) {
            var index = $("#tabs").accordion("option","active");
            if (index == 1) {
                $("#a_name").focus();        
                $("#add-form").keypress(function (e) {
                    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                        $('#create-activity').click();
                        return false;
                    } else {
                        return true;
                    }
                });
                } else if(index == 3 || index == 4) {
            } 
        }
    });    
    if (activityList.list.length === 0) {
        $("#h1a,#h2,#h3,#h4,#h5").hide();
    } 
    $("#ie").button().click(function(){drawChartWindow();});
    $("#print").button().click(function(){drawReportWindow();});
});

function updateScreen() {
}

