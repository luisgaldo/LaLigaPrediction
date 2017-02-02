//Se realiza la consulta SPARQL
function homeTeam() {
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?teamName ?teams where { \
?teams rdf:type la:Team . \
?teams la:hasName ?teamName . }';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla = '<select name="homeTeam" id="homeTeam" class="form-control" onchange="awayTeam(document.getElementById(homeTeam))">';
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
console.log("hola");
var filter = '';
if(team)
	filter = 'FILTER(?teams != '+team+')';
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?teamName ?teams where { \
?teams rdf:type la:Team . \
?teams la:hasName ?teamName .\
 '+filter+' }';

//Se almacena en data toda la información devuelta en la consulta
$.getJSON(SPARQL_ENDPOINT + '?query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0')
    .success(function(data) {
		var feature;
		console.log(data)
		tabla ='<h2>Choose Away Team!</h2> \
					<div class="col-10">' ;
		tabla += '<select name="awayTeam" id="awayTeam" class="form-control" onchange=algChoice(document.getElementById(homeTeam),document.getElementById(awayTeam))>';
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
var filter = '';
if(team)
	filter = 'FILTER(?teams != '+team+')';
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/query';
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?teamName ?teams where { \
?teams rdf:type la:Team . \
?teams la:hasName ?teamName .\
 '+filter+' }';

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
			tabla += "<option value=\""+feature.teams.value+"\">"+feature.teamName.value+"</option>";
		}
		tabla += '</div></div>';
		document.getElementById("homeTeamDescription").innerHTML = tabla;
});
var query ='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
prefix la:<http://www.laligaprediction.com/> \
Select ?teamName ?teams where { \
?teams rdf:type la:Team . \
?teams la:hasName ?teamName .\
 '+filter+' }';

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
			tabla += "<option value=\""+feature.teams.value+"\">"+feature.teamName.value+"</option>";
		}
		tabla += '</div></div>';
		document.getElementById("awayTeamDescription").innerHTML = tabla;
});

}