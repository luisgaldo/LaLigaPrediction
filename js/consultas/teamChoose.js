//Se realiza la consulta SPARQL
var homeTeam;
var awayTeam;

function homeTeam() {
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?teamName ?teams where { \
?teams rdf:type la:Team . \
?teams la:hasName ?teamName . } \
ORDERBY (?teamName)';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla = '<select name="homeTeam" id="homeTeam" class="form-control" onchange="awayTeam($(\'#homeTeam option:selected\').val())">';
		tabla += "<option value=\"-\"></option>";
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += "<option value=\""+feature.teams.value+"\">"+feature.teamName.value+"</option>";
		}
		tabla += '</select>';
		document.getElementById("homeTeamChoose").innerHTML = tabla;
});
}




function awayTeam(team) {
console.log(team);
var filter = '';
if(team)
	filter = 'FILTER(?teams != <'+team+'>)';
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?teamName ?teams where { \
?teams rdf:type la:Team . \
?teams la:hasName ?teamName .\
 '+filter+' } \
ORDERBY (?teamName)';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla ='<h2>Choose Away Team!</h2> \
					<div class="col-10">' ;
		tabla += '<select name="awayTeam" id="awayTeam" class="form-control" onchange="algChoice($(\'#homeTeam option:selected\').val(),$(\'#awayTeam option:selected\').val())">';
		tabla += "<option value=\"-\"></option>";
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += "<option value=\""+feature.teams.value+"\">"+feature.teamName.value+"</option>";
		}
		tabla += '</select>';
		tabla += '</div>';
		document.getElementById("awayTeamChoose").innerHTML = tabla;
});
}

function algChoice(home,away) {
	homeTeam = home;
	awayTeam = away;
	console.log(home);
	console.log(away);
var filter = '';
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
PREFIX dbo: <http://dbpedia.org/ontology/> \
prefix la:<http://www.laligaprediction.com/> \
Select ?abstract where { \
<'+home+'> la:hasLink ?link .\
   SERVICE <http://dbpedia.org/sparql> { \
?link dbo:abstract ?abstract \
    FILTER(LANGMATCHES(LANG(?abstract), "en")) \
  }\
}';
//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla ='<h2>Home Team!</h2> \
					<div class="col-10">' ;
		tabla += '<div id="homeTeamDescription">';
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += feature.abstract.value;
		}
		tabla += '</div></div>';
		document.getElementById("homeTeamDescription").innerHTML = tabla;
});
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
PREFIX dbo: <http://dbpedia.org/ontology/> \
prefix la:<http://www.laligaprediction.com/> \
Select ?abstract where { \
<'+away+'> la:hasLink ?link .\
   SERVICE <http://dbpedia.org/sparql> { \
?link dbo:abstract ?abstract \
    FILTER(LANGMATCHES(LANG(?abstract), "en")) \
  }\
}';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla ='<h2>Away Team!</h2> \
					<div class="col-10">' ;
		tabla += '<div id="awayTeamDescription">';
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += feature.abstract.value;
		}
		tabla += '</div></div>';
		document.getElementById("awayTeamDescription").innerHTML = tabla;
});

tabla = '<h2>Choose The Algorithm</h2><div class="col-10"> </br></br><select name="algorithm_name" id="algorithm" class="form-control" onchange="typeOfAlgorithm($(\'#algorithm option:selected\').val())"> \
  <option value="-"></option> \
  <option value="ind">Individual Comparison</option> \
  <option value="group">Group Comparison</option> \
  <option value="prediction">Prediction</option> \
</select></div>';
document.getElementById("algorithm").innerHTML = tabla;
}

function typeOfAlgorithm(analyze){
	if(analyze == "ind")
		invidualComparison();
	else if (analyze == "group")
		groupComparison();
	else
		prediction(homeTeam,awayTeam);
}

function prediction(home,away) {
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?nameHome ?nameAway ((?totalHomeTotal/?TotalTotal)*100 as ?Away) ((?totalAwayTotal/?TotalTotal)*100 as ?Home)   ((?totalTieTotal/?TotalTotal)*100 as ?Tie) where { \
Select ?nameHome ?nameAway (SUM(?Total) as ?TotalTotal) (SUM(?totalHome) as ?totalHomeTotal)  (SUM(?totalTie) as ?totalTieTotal) (SUM(?totalAway) as ?totalAwayTotal) (COUNT(?match) as ?matches) where { \
Select ?season ?match ?betset ?nameHome ?nameAway  ((?totalHome + ?totalTie + ?totalAway) as ?Total) ?totalHome ?totalTie ?totalAway where { \
Select ?season ?match ?betset ?nameHome ?nameAway (SUM(?homeWins) as ?totalHome) (SUM(?tie) as ?totalTie) (SUM(?awayWins) as ?totalAway) where { \
?match rdf:type la:Match . \
?season rdf:type la:Season. \
?match la:belongsToSeason ?season . \
?match la:hasHomeTeam <'+home+'> . \
?match la:hasAwayTeam <'+away+'> . \
<'+home+'> la:hasName ?nameHome . \
<'+away+'> la:hasName ?nameAway . \
?match la:hasBetSet ?betset . \
?betset la:hasBet ?bets . \
?bets la:hasOdds1 ?homeWins . \
?bets la:hasOddsX ?tie . \
?bets la:hasOdds2 ?awayWins . \
} \
GROUPBY ?season ?match ?betset ?homeGoals ?awayGoals ?nameAway ?nameHome \
} \
GROUPBY ?season ?match ?betset ?homeGoals ?awayGoals ?nameAway ?nameHome ?totalHome ?totalAway ?totalTie  \
} \
GROUPBY ?nameAway ?nameHome \
}';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		feature = data.results.bindings[0];
		console.log(data)
		tabla = '</br><table width=100%><tr><td> <h2>'+feature.nameHome.value+' Wins</h2> </td><td> <h2>Draw</h2> </td><td> <h2>'+feature.nameAway.value+' Wins</h2> </td></tr>';
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += "<tr><td><h3>"+Math.round(feature.Home.value) + "%</h3></td><td><h3>" + Math.round(feature.Tie.value) + "%</h3></td><td><h3>" + Math.round(feature.Away.value)+ "%</h3></td></tr>";
		}
		tabla += '</table>';
		document.getElementById("resultado").innerHTML = tabla;
});
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
SELECT  ?nameHome ?nameAway (ROUND(?homeTeam) as ?homePrediction) (ROUND(?awayTeam) as ?awayPrediction) where { \
SELECT   ?nameHome ?nameAway ((?totalHome/?matches) as ?homeTeam) ((?totalAway/?matches) as ?awayTeam) where { \
Select  ?nameHome ?nameAway (COUNT(?match) as ?matches) (SUM(?homeGoals) as ?totalHome) (SUM(?awayGoals) as ?totalAway) where { \
?match rdf:type la:Match . \
?season rdf:type la:Season . \
?match la:belongsToSeason ?season. \
?match la:hasHomeTeam <'+home+'> . \
?match la:hasAwayTeam <'+away+'> . \
<'+home+'> la:hasName ?nameHome . \
<'+away+'> la:hasName ?nameAway . \
?match la:hasStatistics ?stats . \
?stats la:hasHG ?homeGoals . \
?stats la:hasAG ?awayGoals . \
} \
GROUPBY  ?nameHome ?nameAway \
} \
} \
';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		feature = data.results.bindings[0];
		console.log(data);
		tabla = '</br><table width=100%><tr><td> <h2>'+feature.nameHome.value+'</h2> </td><td> <h2>'+feature.nameAway.value+'</h2> </td></tr>';
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += "<tr><td><h3>"+Math.round(feature.homePrediction.value) + "</h3></td><td><h3>" + Math.round(feature.awayPrediction.value)+ "</h3></td></tr>";
		}
		tabla += '</table>';
		document.getElementById("resultado1").innerHTML = tabla;
});
}


