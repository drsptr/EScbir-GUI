/////////////////////////////
//       ES SETTINGS       //
/////////////////////////////
var HOST = "localhost";
var PORT = 9200;
var SHARDS = 16;
var INDEX_NAME	= "cbir";
var TYPE_NAME	= "yfcc100m";
var FIELD_URI 	= "uri";
var FIELD_IMG	= "deep";
var FIELD_TXT 	= "txt";

var RANDOM_RESULT_SIZE = 24;
var RESULT_SIZE = 120;





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
//    COMMON FUNCTIONS     //
/////////////////////////////
/* It is called whenever a visual or textual search has been performed.
 * Basically, it prints out the resulting images on the screen.
 */
function afterSearchDone(response) {
   var hits = response.hits.hits;
                     
   for(var i=0; i<hits.length; i++)
      resultArray.push(hits[i].fields[FIELD_URI][0]);
                                    
   setQueryDivField("queryTime", eval(response.took/1000) + " s");
   setQueryDivField("queryNumberOfResults", hits.length);
                                    
   hideLoadingAnimation();
                                    
   printPagination(resultArray);
   $(".pagination li:first-child a:first-child").click();
}


/* It gets the document count for the given index and type; then, it asserts the cluster state.
 */
function getStateInfo() {
   client.count(  {
                     index: INDEX_NAME,
                     type: TYPE_NAME
                  },
                  function(error, response) {
                     setDocsCount(response.count);
                  }
               );

   client.cluster.health(   {
                              index: INDEX_NAME
                           },
                           function(error, response) {
                              setClusterState(response["status"]);
                           }
                        );
}





/////////////////////////////
//      RANDOM SEARCH      //
/////////////////////////////
/* It picks 'RANDOM_RESULT_SIZE' images from the index, in a random way,
 * and shows them on the display. This function is called either when the
 * page is loaded for the 1st time, either when the user clicks on the
 * 'Random search' tab in the navigation bar.
 */
function randomSearch() {
   var rndSeed = getSeed();
   var rndShard = random(SHARDS);
   
   resultArray.clear();
   clearQueryDiv();
   clearResults();
   clearPagination();
   showLoadingAnimation();
   
   client.search(    
                  {
                     index: INDEX_NAME,
                     type: TYPE_NAME,
                     size: RANDOM_RESULT_SIZE,
                     fields: FIELD_URI,
                     preference: "_shards:" + rndShard,
                     body: {
                              query:{
                                       function_score:{
                                                         functions:  [
                                                                        {
                                                                           random_score: {seed: rndSeed}
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
/* It performs a visual similarity search, using as input the image with id 'docId',
 * given as input to the function. The document with id 'docId' MUST exist in the index.
 */
function visualSearch(docId) {
   resultArray.clear();
   clearQueryDiv();
   clearResults();
   clearPagination();
   
   printQueryDiv();
   setQueryDivField("queryType", "Visual search");
   showLoadingAnimation();
   
   client.get(
               {
                  index: INDEX_NAME,
                  type: TYPE_NAME,
                  id: docId,
                  _source: FIELD_IMG,
                  fields: FIELD_URI
               },
               function(error, response) {
                  setQueryDivField("queryImgLink", response.fields[FIELD_URI][0]);
                  var toSearch = response._source[FIELD_IMG];
                  
                  client.search(
                                 {
                                    index: INDEX_NAME,
                                    type: TYPE_NAME,
                                    searchType: "dfs_query_then_fetch",
                                    size: RESULT_SIZE,
                                    fields: FIELD_URI,
                                    body: {
                                             query:{
                                                      "query_string":{
                                                                        "fields":[FIELD_IMG],
                                                                        "query": toSearch
                                                                     }
                                                   }
                                          }
                                 },
                                 function(error, response) {
                                    afterSearchDone(response);
                                 }
                              );
               }
            );
}


/* It first checks if the image with id 'docId' exists in the index, then, if it is the
 * case, it performs a standard visual similarity search. It is used to prevent errors.
 */
function visualSearchWithControl(docId) {
   client.exists(
                  {
                     index: INDEX_NAME,
                     type: TYPE_NAME,
                     id: docId
                  },
                  function(error, exists) {
                     if(exists === true)
                        visualSearch(docId);
                     else {
                        resultArray.clear();
                        clearQueryDiv();
                        clearResults();
                        clearPagination();
                        
                        printQueryDiv();
                        setQueryDivField("queryType", "Visual search");
                     }
                  }
                );
}





/////////////////////////////
//     TEXTUAL SEARCH      //
/////////////////////////////
/* It performs a textual search using as input the variable given to the function.
 */
function textualSearch(queryTxt) {
   resultArray.clear();
   clearQueryDiv();
   clearResults();
   clearPagination();
   
   printQueryDiv();
   setQueryDivField("queryType", "Textual search");
   setQueryDivField("queryTxt", queryTxt);
   showLoadingAnimation();
   
   client.search(
                  {
                     index: INDEX_NAME,
                     type: TYPE_NAME,
                     q: FIELD_TXT + ":" + queryTxt,
                     searchType: "dfs_query_then_fetch",
                     size: RESULT_SIZE,
                     fields: FIELD_URI
                  },
                  function(error, response) {
                     afterSearchDone(response);
                  }
               );
}





/////////////////////////////
//         STARTUP         //
/////////////////////////////
/* It gets the number of documents and the clusterState.
 */
getStateInfo();


/* It performs a random search on the startup.
 */
randomSearch(); 