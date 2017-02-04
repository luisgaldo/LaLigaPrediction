function stadiumMatch(){
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?match ?stadium where { \
?match rdf:type la:Match . \
?match la:hasStadium ?stadium . \
} \
LIMIT 10';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla = "";
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += feature.match.value + "\t" + feature.stadium.value+ "\n" ;
		}
		document.getElementById("stadiumMatch").innerHTML = tabla;
});
}

function stadiumMatchInference(){
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/update?update=';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
insert \
{ \
?match la:hasStadium ?stadium \
} \
where { \
?match rdf:type la:Match . \
?match la:hasHomeTeam ?hometeam . \
?hometeam la:hasStadium ?stadium . \
} \
';
$.ajax({
    url: SPARQL_ENDPOINT,
    type: 'POST',
    data: query,
    contentType: 'application/sparql-update',
    dataType: 'json',
    success: function(msg) {
    }
});
//Se almacena en data toda la información devuelta en la consulta

}



function gamesSeason(){
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='prefix la:<http://www.laligaprediction.com/> \
select * where { \
?season la:hasMatch ?match \
} \
LIMIT 10';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla = "";
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += feature.season.value + "\t" + feature.match.value+ "\n" ;
		}
		document.getElementById("gamesSeason").innerHTML = tabla;
});
}

function gamesSeasonInference(){
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/update?update=';
var query ='prefix la:<http://www.laligaprediction.com/> \
insert { \
  ?season la:hasMatch ?match \
} \
where { \
?match la:belongsToSeason ?season \
} \
';
$.ajax({
    url: SPARQL_ENDPOINT,
    type: 'POST',
    data: query,
    contentType: 'application/sparql-update',
    dataType: 'json',
    success: function(msg) {
    }
});
//Se almacena en data toda la información devuelta en la consulta

}

function cityTeam(){	
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select * where { \
?team rdf:type la:Team . \
?team la:belongsToCity ?city \
} \
LIMIT 10';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla = "";
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			tabla += feature.team.value + "\t" + feature.city.value+ "\n" ;
		}
		document.getElementById("cityTeam").innerHTML = tabla;
});
}

function cityTeamInference(){
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/update?update=';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
insert{ \
  ?team la:belongsToCity ?city \
} \
where { \
?stadium rdf:type la:Stadium . \
?stadium la:belongsToCity ?city. \
?stadium la:hasTeam ?team . \
} \
';
$.ajax({
    url: SPARQL_ENDPOINT,
    type: 'POST',
    data: query,
    contentType: 'application/sparql-update',
    dataType: 'json',
    success: function(msg) {
    }
});
//Se almacena en data toda la información devuelta en la consulta

}




function winnerSeason(){
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \
Select * where { \
  ?season la:hasChampion ?team \
}';
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
				.success(function(data) {
					var feature;
					var tabla = "";
					console.log(data)
					for (var i = 0; i < data.results.bindings.length; i++) {
						feature = data.results.bindings[i];
						tabla += feature.season.value + "\t" + feature.team.value+ "\n" ;
					}
					document.getElementById("winnerSeason").innerHTML = tabla;
			});
//Se almacena en data toda la información devuelta en la consulta

}


function winnerSeasonInference(){
$.ajaxSetup({
    async: false
});	
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?season  (MAX(?temporada) as ?ganador) where { \
Select ?season ?team (SUM(?total) as ?temporada) where { \
{ \
  Select ?season ?team (SUM(?points) as ?total) where { \
?season rdf:type la:Season . \
?match rdf:type la:Match . \
?match la:belongsToSeason ?season . \
?match la:hasHomeTeam ?team . \
?match la:hasStatistics ?stats . \
?stats la:hasHP ?points . \
} \
  GroupBY ?team ?season \
  } \
  Union \
  { \
Select ?season ?team (SUM(?points) as ?total) where { \
?season rdf:type la:Season . \
?match rdf:type la:Match . \
?match la:belongsToSeason ?season . \
?match la:hasAwayTeam ?team . \
?match la:hasStatistics ?stats . \
?stats la:hasAP ?points . \
} \
GroupBY ?team ?season \
} \
} \
GroupBY ?season ?team \
} \
GroupBY ?season';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla = "";
		for (var i = 0; i < data.results.bindings.length; i++) {
			feature = data.results.bindings[i];
			season = feature.season.value;
			points = feature.ganador.value;
			console.log(season);
			console.log(points);
			var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
						prefix la:<http://www.laligaprediction.com/> \
						PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \
						insert { \
						  ?season la:hasChampion ?team \
						} \
						where { \
						{ \
						Select ?season ?team (SUM(?total) as ?temporada) where { \
						{ \
						  Select ?season ?team (SUM(?points) as ?total) where { \
						?season rdf:type la:Season . \
						?match rdf:type la:Match . \
						?match la:belongsToSeason ?season . \
						?match la:hasHomeTeam ?team . \
						?match la:hasStatistics ?stats . \
						?stats la:hasHP ?points . \
						} \
						  GroupBY ?team ?season \
						  } \
						  Union \
						  { \
						Select ?season ?team (SUM(?points) as ?total) where { \
						?season rdf:type la:Season . \
						?match rdf:type la:Match . \
						?match la:belongsToSeason ?season . \
						?match la:hasAwayTeam ?team . \
						?match la:hasStatistics ?stats . \
						?stats la:hasAP ?points . \
						} \
						GroupBY ?team ?season \
						} \
						} \
						GroupBY ?season ?team \
						} \
						  FILTER(?season=<'+season+'> && ?temporada='+points+') \
						}';

			//Se almacena en data toda la información devuelta en la consulta
			$.ajax({
			url: 'http://localhost:3030/myDataset/update?update=',
			type: 'POST',
			data: query,
			contentType: 'application/sparql-update',
			dataType: 'json',
			success: function(msg) {
			}
		
			});
			
		}
});
$.ajaxSetup({
    async: true
});
}
