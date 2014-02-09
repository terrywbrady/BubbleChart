var activityList;
var activityForm;
var tips;

function ActivityForm() {
	this.selectedActivity = null;
}

ActivityForm.prototype.createDialogForm = function(activity) {
	$("#dialog-form").remove();
	this.selectedActivity = activity;
	var df = $('<div id="dialog-form" title="Define a weekly activity"/>')
	.append(
		$('<form/>')
			.append($('<fieldset>')
				.append('<label for="name">Activity Name</label>')
				.append('<input type="text" name="name" id="name" class="long text ui-widget-content ui-corner-all" /> ')
				.append('<label for="hours">Hours Per Week</label>')
				.append('<input type="number" maxlength="4" size="4" name="hours" id="hours" value="" class="short text ui-widget-content ui-corner-all" />')
		)
	)
	.append('<div class="validateTips">Both fields are required.</div>');
	if (activity !== null) { 
		df.attr("title", "Update Weekly Activity");
		df.find("#name").val(activity.name);
		df.find("#hours").val(activity.hours);
	}
	return df;
};

function getAllFields() {
	return $("#name, #hours");
}

var updateActivity = function() {
	var name = $( "#name" ),
	hours = $( "#hours" ),
	bValid = true;
	getAllFields().removeClass( "ui-state-error" );

	bValid = bValid && checkRegexp( hours, /^([0-9\.])+$/, "Please enter a number for hours" );
	bValid = bValid && checkRegexp( name, /^.*\S+.*$/, "Please enter an activity name" );

	if ( bValid ) {
		activityForm.selectedActivity.setName(name.val());
		activityForm.selectedActivity.hours = Number(hours.val());
		activityList.save();
		activityList.drawTable(false);
		$( this ).dialog( "close" );
	}
	
};

function addActivity() {
	var name = $( "#a_name" ),
	hours = $( "#a_hours" ),
	bValid = true;
	$("#a_name, #a_hours").removeClass( "ui-state-error" );

	bValid = bValid && checkRegexp( hours, /^([0-9\.])+$/, "Please enter a number for hours" );
	bValid = bValid && checkRegexp( name, /^.*\S+.*$/, "Please enter an activity name" );

	if ( bValid ) {
		activityList.addActivity(name.val(), hours.val());
		$("#a_name").val("").focus();
		$("#a_hours").val("");
		activityList.drawTable(false);
	}
	
};


function updateTips( t ) {
	tips = $( ".validateTips" );
	tips
		.text( t );
//		.addClass( "ui-state-highlight" );
//	setTimeout(function() {
//		tips.removeClass( "ui-state-highlight", 400 );
//	}, 500 );
}

function checkRegexp( o, regexp, n ) {
	if ( !( regexp.test( o.val() ) ) ) {
		o.addClass( "ui-state-error" );
		o.focus();
		updateTips( n );
		return false;
	} else {
		return true;
	}
}

ActivityForm.prototype.itemSel = function(id) {
	$("#remove-activity, #edit-activity").show();
	this.selectedActivity = activityList.findItem(id);
}


$(function() {
	// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
	$( "#dialog:ui-dialog" ).dialog( "destroy" );
	
	$( "#create-activity" )
		.button()
		.click(function() {
			addActivity();
		});
	$( "#edit-activity" )
	.button()
	.click(function() {
		var dialogForm = activityForm.createDialogForm(activityForm.selectedActivity);

		dialogForm.dialog({
			autoOpen: false,
			height: 280,
			width: 350,
			modal: true,
			buttons: {
				"Update Activity": updateActivity,
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			},
			close: function() {
				getAllFields().val( "" ).removeClass( "ui-state-error" );
			}
		});
		$( "#dialog-form" ).dialog( "open" );
	});
	$( "#remove-activity" )
	.button().click(function() {
		activityList.remove(activityForm.selectedActivity);
		activityList.drawTable(false);
	});
});

