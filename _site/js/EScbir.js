var HOST = "localhost";
var PORT = 9200;

var INDEX_NAME	= "cbir";
var TYPE_NAME	= "yfcc100m";

var FIELD_URI 	= "uri";
var FIELD_IMG	= "encoded_features";
var FIELD_TXT 	= "tags";

function ESManager() {
	this.client;
	this.response;
	
	this.connect = connect;
	this.get = get;
	this.queryStringSearch = queryStringSearch;
}

function connect(host, port) {
	_host = host + ":" + port;
	this.client = new $.es.Client(	{
										hosts: _host
									}
								 );
}

function get(indexName, typeName, docId) {
	alert("get");
	this.client.get(	{
							index: INDEX_NAME,
							type: TYPE_NAME,
							id: 4888431878
						}, 
						function (error, response) {
							alert(JSON.stringify(response._source, null, "  "));
						}
					);
}

function queryStringSearch() {
	alert("search");
}

var esm = new ESManager();
esm.connect(HOST, PORT);

/*
<div id="queryDiv">
            <span id="queryImg"><img src="http://farm5.staticflickr.com/4137/4888431878_5470a5578b.jpg" alt="query image"></span>
            <span>Searching</span>
            <span id="queryText">'query text'</span>
            <span id="queryTime">in 0.255s</span>
         </div>
*/