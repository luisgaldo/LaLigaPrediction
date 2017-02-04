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
			tabla += feature.match.value + "\t" + feature.stadium.value;
		}
		document.getElementById("stadiumMatch").innerHTML = tabla;
});
}

function stadiumMatchInference(){
var SPARQL_ENDPOINT = 'http://localhost:3030/myDataset/update';
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

//Se almacena en data toda la información devuelta en la consulta
console.log(SPARQL_ENDPOINT + '?update=' +encodeURIComponent(query)+'&format=application%2Fsparql-results%2Bjson');
$.post(SPARQL_ENDPOINT + '?update=' + encodeURIComponent(query)+ '&format=application%2Fsparql-results%2Bjson')
    .success(function(data) {
		console.log(data);
},'json');
}