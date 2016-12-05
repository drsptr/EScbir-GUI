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
var TOT_DOCS;





/////////////////////////////
//        ES CLIENT        //
/////////////////////////////
/* It creates a new client which connects to the ES cluster.
 */
client = new $.es.Client(  {
                              hosts: HOST + ":" + PORT
                           }
                        );
                        


                        
 
/////////////////////////////
//       RESULT ARRAY      //
/////////////////////////////
var resultArray = [];




 
/////////////////////////////
//      RANDOM SEARCH      //
/////////////////////////////
var RANDOM_RESULT_SIZE = 18;

/* It picks 'RANDOM_RESULT_SIZE' images from the index, in a random way,
 * and shows them on the display. This function is called either when the
 * page is loaded for the 1st time, either when the user clicks on the
 * 'Random search' tab in the navigation bar.
 */
function randomSearch() {
   var rndSeed = getSeed();
   
   resultArray.clear();
   clearQueryDiv();
   clearResults();
   showLoadingAnimation();
   
   client.search(    
                  {
                     index: INDEX_NAME,
                     type: TYPE_NAME,
                     size: RANDOM_RESULT_SIZE,
                     fields: FIELD_URI,
                     body: {
                              query:{
                                       function_score:{
                                                         functions:  [
                                                                        {
                                                                           random_score: {seed: 0/*rndSeed*/}
                                                                        }
                                                                     ]
                                                      }
                                    }
                           }
                  },
                  function(error, response) {
                     var hits = response.hits.hits;
                     
                     for(var i=0; i<hits.length; i++)
                        resultArray.push(hits[i].fields[FIELD_URI][0]);
                     hideLoadingAnimation();
                     
                     printResults(resultArray, 0, RANDOM_RESULT_SIZE);
                  }
               );
}


/* It sets the 'onclick' event for the 'Random search' tab.
 */
$("#randomSearchButton").click(randomSearch);





/////////////////////////////
//      VISUAL SEARCH      //
/////////////////////////////
function visualSearch(docId) {
   resultArray.clear();
   clearQueryDiv();
   clearResults();
   
   printQueryDiv();
   // -> setQueryDivField
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





/////////////////////////////
//         STARTUP         //
/////////////////////////////
/* It gets the document count for the given index and type.
 */
client.count(  {
                  index: INDEX_NAME,
                  type: TYPE_NAME
               },
               function(error, response) {
                  TOT_DOCS = response.count;
               }
            );

            
/* It gets the cluster state and set it.
 */
client.cluster.health(   {
                           index: INDEX_NAME
                        },
                        function(error, response) {
                           setClusterState(response["status"]);
                        }
                     );
                     

/* It performs a random search on the startup.
 */
randomSearch(); 