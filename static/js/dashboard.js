var update_mini_scoreboard = function(){
 $.getJSON( "/mini_scoreboard_data", function(data) {
   var entries = "";
   var teamstat = data['teamstat'];

   for( var i=0; i<teamstat.length; i++ ) {
	 entries += "<tr class='entry'>";
	 entries += "<td>" + escape_html(String(teamstat[i]["team_name"])) + "</td>";
	 entries += "<td>" + escape_html(String(teamstat[i]["score"])) + "</td>"
	 entries += "</tr>";
   }
   $("#mini-scoreboard tbody").html(entries);
   $("#last-update").text("Last Update: " + data['last_update']);
 });
};
update_mini_scoreboard();
setInterval(update_mini_scoreboard, 120000);

var update_dashboard_problems = function(){
    $.get("/dashboard_problems", function(data){
        $('#dashboard-problems').html(data);
    });
};
update_dashboard_problems();
setInterval(update_dashboard_problems, 120000);

var csrftoken = $.cookie ("csrftoken");
function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
	beforeSend: function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	}
});

$("#flag_submit_button").on ("click", function () {
	if (submit_flag_with_rsa) {
		var key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr4S0OcVXulgokYuTWp/ZuMCVGx1EanUoJhTZp+ZKm58GHv61tHIGdsPDSSJaQ5w+n3ViqdeaduAm52f6sYmtymfllxnIfeB9xM7U/liNj3sSW44sYn3MN+L9clf8/Vxg2L13x6yglAnRsLh6gn4WKskHVRNlvKk4nG1TmhxWVI/n3LTiXpzS4GOIsyrQ+2CAuvfgWCmR0t1rmwacswULuQ50sA5AfpaXSJ+H+4l8dnAxbBDyfwkm6HXUdxJDxtitTO85dCtZeUDK6IewFSB0oceuHZAshygE7Hzo4hqOXOzhQes1QCGW/ZYLvt+vg5xTFf1ZVV7enSRMqAxaDA1Z6wIDAQAB";
		var encrypted_flag = encflag_rsa(team_id, $("#flag").val(), key);
	} else {
		var encrypted_flag = encflag(team_id, $("#flag").val());
	}
	$('#submit-status').text('');
	$.post ("/flag_submit",
	{"encflag": encrypted_flag},
	function (data, textStatus, jqXHR) {
		if (data == 'error') {
			$('#submit-status').text('Slow down! Submit after 30 seconds.');
		} else if (data) {
			var flag_obj = $("#flag-id-" + data);
			flag_obj.fadeOut(400, function(){
				flag_obj.addClass('solved');
				flag_obj.fadeIn(400);
			});
			$('#submit-status').text('Correct flag. Grats!');
		} else {
			$('#submit-status').text('Wrong flag. Noooooo~');
		}
	}).fail(function(){
		$('#submit-status').text('Submission error. Please try again later.');
	});
});

ANNOUNCEMENTS_UPDATE_INTERVAL = 30000;

// handling function for successfully fetching announcements
function fetch_announcements_success(data)
{
	elem_ul = $("#dashboard-announcements > ul");
	curr_count = elem_ul.children().length;
	is_first_query = (curr_count == 0);

	for (index = data.length - curr_count - 1; index >= 0; index--)
	{
		announcement = data[index];

		elem_description = $("<div></div>")
			.text(announcement["description"])
			.css("display", "none");

		elem_title = $("<a></a>")
			.text(announcement["time"] + ": " + announcement["title"])
			.attr("href", "javascript:void(0)")
			.click(function() {
					$(this).parent().children("div").slideToggle('fast');
					});

		elem_entry = $("<li></li>")
			.append(elem_title)
			.append(elem_description);

		if (is_first_query) {
			elem_entry.prependTo(elem_ul);
		} else {
			elem_entry.prependTo(elem_ul).slideDown().fadeOut().fadeIn().fadeOut().fadeIn();
		}
	}
}

// handling function for failing to fetch announcements
function fetch_announcements_fail(jqXHR)
{
	console.error('failed to fetch announcements');
}

// periodly update announcements
function update_announcements()
{
	$.ajax({url: window.location.origin + "/announcement_data",
			dataType: "json",
			success: fetch_announcements_success,
			error: fetch_announcements_fail});
}

update_announcements();
setInterval(update_announcements, ANNOUNCEMENTS_UPDATE_INTERVAL);

// problem info popup
$(document).on('click', '.problem-entry.unlocked', function(){
	var info_obj = $(this).children('.problem-info');
	var info = {
		'title': info_obj.children('.title').children('p').children('.tititle').html(),
		'description': info_obj.children('.description').html(),
		'hint': info_obj.children('.hint').html()
	};
	$.fancybox('<div class="fancybox-contents">' +
		'<h1>' + info.title + '</h1>' +
		'<h3>Description</h3><p>' + info.description + '</p>' +
		'<h3>Hint</h3><p>' + (info.hint ? info.hint : 'None') + '</p>' +
		'</div>',
		{'width': 700, 'height': 500});
});
