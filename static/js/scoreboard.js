var update_scoreboard = function(){
 $.getJSON( "scoreboard_data", function(data) {
   var entries = "";
   var teamstat = data['teamstat'];
   var flags = data['flags'];
   var flags_score = data['flags_score'];
   var total = {};

   for( var i=0; i<flags.length; i++ ) {
     total[flags[i]] = 0;
   }

   for( var i=0; i<teamstat.length; i++ ) {
     entries += "<tr class='entry'>";
     entries += "<td>" + escape_html(String(teamstat[i]["rank"])) + "</td>";
     entries += "<td style='word-wrap:break-word;'><a class='team-url' href='/team/" + escape_html(String(teamstat[i]['team_id'])) + "'>"
				 + escape_html(String(teamstat[i]["team_name"])) + "</a></td>";
     entries += "<td> <img src=" + escape_html(String(teamstat[i]["country_url"])) + "></img> </td>";
     entries += "<td>" + escape_html(String(teamstat[i]["score"])) + "</td>"
     for( var j=0; j<flags.length; j++ ) {
       var k=0;
       for( ; k<teamstat[i]['solved_probs'].length; k++ ) {
         if( teamstat[i]['solved_probs'][k][0] == flags[j] ) {
           total[flags[j]] += 1;
           break;
         }
       }
       if( k == teamstat[i]['solved_probs'].length ){
         entries += "<td class='unsolved'></td>";
       }else{
         entries += "<td class='solved show-on-hover'><div>"+escape_html(String(teamstat[i]['solved_probs'][k][2]))+"</div></td>";
       }

     }
     entries += "</tr>";
   }

   thead_tr = '<th style="width:50px;">Rank</th>'
     + '<th style="width:160px;">Team Name</th>'
     + '<th style="width:65px;">Country</th>'
     + '<th style="width:65px;">Score</th>';
   for( var i=0; i<flags.length; i++ ) {
     thead_tr += '<th class="flag show-on-hover"><span class="glyphicon glyphicon-flag"></span><div>' + escape_html(String(flags[i])) +
                 " (" + escape_html(String(flags_score[flags[i]])) + ")" + "<p>" + escape_html(total[flags[i]]) + " solves</p></div></th>";
   }

   $("#scoreboard thead tr").html(thead_tr);

   total_entry = "<tr><td id='total-title' colspan=4>Total</td>";

   for( var i=0; i<flags.length; i++ ) {
	   total_entry += "<td>" + escape_html(total[flags[i]]) + "</td>";
   }
   entries += total_entry;
   $("#scoreboard tbody").html(entries);
   $("#last-update").text("Last Update: " + data['last_update']);
 });
};
update_scoreboard();
setInterval(update_scoreboard, 30000);
