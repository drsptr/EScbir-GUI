/////////////////////////////
//       ES SETTINGS       //
/////////////////////////////
var HOST = "localhost";
var PORT = 9200;
var INDEX_NAME	= "cbir";
var TYPE_NAME	= "yfcc100m";
var FIELD_URI 	= "uri";
var FIELD_IMG	= "encoded_features";
var FIELD_TXT 	= "tags";





/////////////////////////////
//        ES CLIENT        //
/////////////////////////////
/* It creates a new client which connects to the ES cluster.
 */
client = new $.es.Client(  {
                              hosts: HOST + ":" + PORT;
                           }
                        );

                        

                        
                        
/////////////////////////////
//      RANDOM SEARCH      //
/////////////////////////////
var RANDOM_RESULT_SIZE = 18;

function randomSearch(resultSize) {
   // TODO generate a random number between
   startingIndex = 10;
   client.search(    {
                        index: INDEX_NAME,
                        type: TYPE_NAME,
                        size: RANDOM_RESULT_SIZE,
                        from: startingIndex
                     },
                     function(error, response) {
                        alert(JSON.stringify(response._source, null, "  "));
                     }
               );
}

$("#visualSearchButton")




                      
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