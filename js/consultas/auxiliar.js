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
		tabla = '<select name="homeTeam" id="homeTeam" class="form-control" onchange="awayTeam($(\'#homeTeam option:selected\').val());homeDescription($(\'#homeTeam option:selected\').val());">';
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
		tabla += '<select name="awayTeam" id="awayTeam" class="form-control" onchange="awayDescription($(\'#awayTeam option:selected\').val());algoChoice();">';
		tabla += "<option value=\"-\"></option>";
		for ( i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += "<option value=\""+feature.teams.value+"\">"+feature.teamName.value+"</option>";
		}
		tabla += '</select>';
		tabla += '</div>';
		document.getElementById("awayTeamChoose").innerHTML = tabla;
});
}

function homeDescription(home) {
homeTeam = home;
	console.log(home);
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
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=100')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla ='<h2>Home Team!</h2> \
					<div class="col-10">' ;
		tabla += '<div id="homeTeamDescription">';
		for ( i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += feature.abstract.value;
		}
		tabla += '</div></div>';
		document.getElementById("homeTeamDescription").innerHTML = tabla;
});
}
function awayDescription(away) {
awayTeam = away;
var filter = '';
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
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
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=100')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla ='<h2>Away Team!</h2> \
					<div class="col-10">' ;
		tabla += '<div id="awayTeamDescription">';
		for ( i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += feature.abstract.value;
		}
		tabla += '</div></div>';
		document.getElementById("awayTeamDescription").innerHTML = tabla;
});
}
function algoChoice(){
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
		invidualComparison(homeTeam,awayTeam);
	else if (analyze == "group")
		groupComparison(homeTeam,awayTeam);
	else
		prediction(homeTeam,awayTeam);
}

function prediction(home,away) {
document.getElementById("resultado").innerHTML = "";
document.getElementById("resultado1").innerHTML = "";
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
		for ( i = 0; i < data.results.bindings.length; i++) {
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
		for ( i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += "<tr><td><h3>"+Math.round(feature.homePrediction.value) + "</h3></td><td><h3>" + Math.round(feature.awayPrediction.value)+ "</h3></td></tr>";
		}
		tabla += '</table>';
		document.getElementById("resultado1").innerHTML = tabla;
});
}

function groupComparison(home,away) {
document.getElementById("resultado").innerHTML = "";
document.getElementById("resultado1").innerHTML = "";
$.ajaxSetup({
    async: false
});
	groupComparisonTeam(home,0);
	groupComparisonTeam(away,1);
$.ajaxSetup({
    async: true
});
}
function groupComparisonTeam(team,type){
var kind = 'la:hasHomeTeam';
var kind1 = 'la:hasHP';
var kind2 = 'la:hasHG';
var kind3 = 'la:hasAG';
if (type == 1){
	kind = "la:hasAwayTeam";
	kind1 = "la:hasAP";
	kind2 = "la:hasAG";
	kind3 = 'la:hasHG';
}
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?season ?nameSeason where { \
?season rdf:type la:Season. \
?season la:hasName ?nameSeason . \
} \
ORDERBY ?season';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=100')
    .success(function(data) {
		var feature;
		console.log(data);
		var nameTeam = '';
		var numberOfMatches = 0;
		var numberOfWins = 0;
		var numberOfTies = 0;
		var numberOfLoses = 0;
		var puntosTotales = 0;
		var numbersOfGoalsScored = 0;
		var numbersOfGoalsReceived = 0;
		var season = '';
		for ( i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			temporada = feature.season.value;
			seasonName = feature.nameSeason.value;
			var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
			var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
						prefix la:<http://www.laligaprediction.com/> \
						Select ?teamName (COUNT(?match) as ?numberMatches) where { \
						?match rdf:type la:Match . \
						?match la:belongsToSeason <'+temporada+'> . \
						?match '+kind+' <'+team+'> . \
						<'+team+'> la:hasName ?teamName . \
						} \
						GROUPBY ?teamName \
						';

			//Se almacena en data toda la información devuelta en la consulta
			$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=100')
				.success(function(data) {
					//console.log(data)
					console.log("Número de partidos")
					nameTeam = data.results.bindings[0].teamName.value ;
					numberOfMatches = data.results.bindings[0].numberMatches.value;
			});
			for( j = 0;j<3;j++){
				var condition = 0;
				var res = 'loses';
				if (j == 0){
					condition = 3;
					res = 'wins';
				}
				else if (j == 1){
					condition = 1;
					res = 'ties';
				}
				console.log(res);
				console.log(temporada);
				console.log(kind);
				console.log(team);
				console.log(condition);
				var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
				var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
							prefix la:<http://www.laligaprediction.com/> \
							Select (COUNT(?points) as ?algo) where { \
							?match rdf:type la:Match . \
							?match la:belongsToSeason <'+temporada+'> . \
							?match '+kind+' <'+team+'> . \
							?match la:hasStatistics ?stats . \
							?stats '+kind1+' ?points \
							FILTER(?points='+condition+') \
							} \
							';

				//Se almacena en data toda la información devuelta en la consulta
				$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=100')
					.success(function(data) {
						console.log("VALOR DE J " + j)
						if(j==0)
							numberOfWins=data.results.bindings[0].algo.value;
						else if(j==1)
							numberOfTies=data.results.bindings[0].algo.value;
						else
							numberOfLoses=data.results.bindings[0].algo.value;
							
				});
			}
			var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
			var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
						prefix la:<http://www.laligaprediction.com/> \
						Select (SUM(?goals) as ?goalsScored) (SUM(?goalsR) as ?goalsReceived) where { \
						?match rdf:type la:Match . \
						?match la:belongsToSeason <'+temporada+'>  . \
						?match '+kind+' <'+team+'> . \
						?match la:hasStatistics ?stats . \
						?stats '+kind2+' ?goals . \
						?stats '+kind3+' ?goalsR . \
						}';

			//Se almacena en data toda la información devuelta en la consulta
			$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=100')
				.success(function(data) {
					//console.log(data)
					numbersOfGoalsScored = data.results.bindings[0].goalsScored.value;
					numbersOfGoalsReceived = data.results.bindings[0].goalsReceived.value;
			});
			puntosTotales = parseInt(numberOfWins*3) + parseInt(numberOfTies);
			tabla=nameTeam+'\t'+seasonName+'\t'+numberOfMatches+'\t'+numberOfWins+'\t'+numberOfTies+'\t'+numberOfLoses+'\t'+puntosTotales+'\t'+numbersOfGoalsScored+'\t'+numbersOfGoalsReceived+'\n';
		if(type == 0)
			document.getElementById("resultado").innerHTML += tabla;
		else
			document.getElementById("resultado1").innerHTML += tabla;
		}
		
});
}

function invidualComparison(home,away){
document.getElementById("resultado").innerHTML = "";
document.getElementById("resultado1").innerHTML = "";
var homeTeamName = '';
var awayTeamName = '';
var homeGoals = 0;
var awayGoals = 0;
var homeShots = 0;
var awayShots = 0;
var homeShotsTarget = 0;
var awayShotsTarget = 0;
var homeCorners = 0;
var awayCorners = 0;
var homeFouls = 0;
var awayFouls = 0;
var homeYellow = 0;
var awayYellow = 0;
var homeRed = 0;
var awayRed = 0;
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='prefix la:<http://www.laligaprediction.com/> \
select ?Matches ?homeTeam \
	(round(?Avg_Shots_hpm) as ?Average_Shots_ht) \
	(round(?Avg_Shots_apm) as ?Average_Shots_at) \
	(round(?Average_Shots_on_Target_ht) as ?Average_Shots_on_Target_hpm) \
	(round(?Average_Shots_on_Target_at) as ?Average_Shots_on_Target_apm) \
	(round(?Avg_Fouls_hpm) as ?Avg_Fouls_ht) \
	(round(?Avg_Fouls_apm) as ?Avg_Fouls_at) \
	(round(?Avg_Corner_Kicks_hpm) as ?Avg_Corner_Kicks_ht) \
	(round(?Avg_Corner_Kicks_apm) as ?Avg_Corner_Kicks_at) \
	(round(?Avg_Yellow_Cards_hpm) as ?Avg_Yellow_Cards_ht) \
	(round(?Avg_Yellow_Cards_apm) as ?Avg_Yellow_Cards_at) \
	(round(?Avg_Red_Cards_hpm) as ?Avg_Red_Cards_ht) \
	(round(?Avg_Red_Cards_apm) as ?Avg_Red_Cards_at) \
	?Goals_Scored_ht ?Goals_Scored_at ?awayTeam where{ \
select (count(distinct ?match) as ?Matches) ?homeTeam \
  (SUM(?shots_h)/?Matches as ?Avg_Shots_hpm) \
  (SUM(?shots_a)/?Matches as ?Avg_Shots_apm) \
  (SUM(?shotsT_h)/?Matches as ?Average_Shots_on_Target_ht) \
  (SUM(?shotsT_a)/?Matches as ?Average_Shots_on_Target_at) \
  (SUM(?fouls_h)/?Matches as ?Avg_Fouls_hpm) \
  (SUM(?fouls_a)/?Matches as ?Avg_Fouls_apm) \
  (SUM(?corners_h)/?Matches as ?Avg_Corner_Kicks_hpm) \
  (SUM(?corners_a)/?Matches as ?Avg_Corner_Kicks_apm) \
  (SUM(?yellowC_h)/?Matches as ?Avg_Yellow_Cards_hpm) \
  (SUM(?yellowC_h)/?Matches as ?Avg_Yellow_Cards_apm) \
  (SUM(?redC_A)/?Matches as ?Avg_Red_Cards_hpm) \
  (SUM(?redC_B)/?Matches as ?Avg_Red_Cards_apm) \
  (SUM(?goA) as ?Goals_Scored_ht) \
  (SUM(?goB) as ?Goals_Scored_at) \
  ?awayTeam where {  \
?match la:hasHomeTeam <'+home+'> . \
<'+home+'> la:hasName ?homeTeam . \
?match la:belongsToSeason ?sseason . \
?sseason la:hasName ?season . \
?match la:hasAwayTeam <'+away+'> . \
<'+away+'> la:hasName ?awayTeam . \
?match la:hasStatistics ?Stats . \
?Stats la:hasHS ?shots_h . \
?Stats la:hasAS ?shots_a . \
?Stats la:hasHST ?shotsT_h . \
?Stats la:hasAST ?shotsT_a . \
?Stats la:hasHF ?fouls_h . \
?Stats la:hasAF ?fouls_a . \
?Stats la:hasHC ?corners_h . \
?Stats la:hasAC ?corners_a . \
?Stats la:hasHY ?yellowC_h . \
?Stats la:hasAY ?yellowC_a . \
?Stats la:hasHR ?redC_A . \
?Stats la:hasAR ?redC_B . \
?Stats la:hasHG ?goA . \
?Stats la:hasAG ?goB . \
} \
groupby ?homeTeam ?awayTeam ?Goals_Scored_ht ?Goals_Scored_at  \
} \
';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=100')
	.success(function(data) {
		console.log(data)
		var feature = data.results.bindings[0];
		homeTeamName = feature.homeTeam.value;
		awayTeamName = feature.awayTeam.value;
		homeGoals = feature.Goals_Scored_ht.value;
		awayGoals = feature.Goals_Scored_at.value;
		homeShots = feature.Average_Shots_ht.value;
		awayShots = feature.Average_Shots_at.value;
		homeShotsTarget = feature.Average_Shots_on_Target_hpm.value;
		awayShotsTarget = feature.Average_Shots_on_Target_apm.value;
		homeCorners = feature.Avg_Corner_Kicks_ht.value;
		awayCorners = feature.Avg_Corner_Kicks_at.value;
		homeFouls = feature.Avg_Fouls_ht.value;
		awayFouls = feature.Avg_Fouls_at.value;
		homeYellow = feature.Avg_Yellow_Cards_ht.value;
		awayYellow = feature.Avg_Yellow_Cards_at.value;
		homeRed = feature.Avg_Red_Cards_ht.value;
		awayRed = feature.Avg_Red_Cards_at.value;
		console.log(homeTeamName);
		tabla=homeTeamName+'\t'+homeGoals+'\t'+homeShots+'\t'+homeShotsTarget+'\t'+homeCorners+'\t'+homeFouls+'\t'+homeYellow+'\t'+homeRed+'\n';
		tabla+=awayTeamName+'\t'+awayGoals+'\t'+awayShots+'\t'+awayShotsTarget+'\t'+awayCorners+'\t'+awayFouls+'\t'+awayYellow+'\t'+awayRed+'\n';
		document.getElementById("resultado").innerHTML = tabla;
});

}