/////////////////////////////
//         STARTUP         //
/////////////////////////////
/* It sets the just clicked item on the navbar in the active state. When the user clicks on an item
 * on the navbar, its color becames darker.
 */
$("ul.nav.navbar-nav a").click(  function() {
                                    $("ul.nav.navbar-nav li").removeAttr("class");
                                    $(this).parent().attr("class", "active");
                                 }
                              );

                              
/* It sets the search bar visible when the 'visualSearchButton' is pressed.
 */
$("#visualSearchButton").click(displaySearchBar);


/* It sets the search bar visible when the 'textualSearchButton' is pressed.
 */
$("#textualSearchButton").click(displaySearchBar);


/* It sets the search bar hidden when the 'visualSearchButton' is pressed.
 */
$("#randomSearchButton").click(hideSearchBar);


/* It sets the click event on the button in the search bar.
 */
$("#searchBarForm button").click(navBarSearch);


/* It sets the keydown event on input in the search bar when the 'Enter' button is pressed.
 */
$("#searchBarForm input").keydown(  function() {
                                       if(event.keyCode == 13)
                                          navBarSearch();
                                    }
                                 );
                              
                              



/////////////////////////////
//          GENERAL        //
/////////////////////////////
/* It sets the color of the span according to the current cluster's state.
 */
function setClusterState(state) {
   var span = $("#clusterStateSpan");
   
   span.removeAttr("class");
   
   switch(state) {
      case "green":
         span.attr("class", "label label-success");
         break;
      case "yellow":
         span.attr("class", "label label-warning");
         break;
      case "red":
         span.attr("class", "label label-danger");
   }
   
   span.text(state);
}


function setDocsCount(dCount) {
   var txt;
   
   docsCount = Number("100000");
   
   if(docsCount >= 1000000) 
      txt = (docsCount/1000000).toFixed(1).replace(/\.0$/, '') + "M";
   else if (docsCount >= 1000)
      txt = (docsCount/1000).toFixed(1).replace(/\.0$/, '') + "K";
   else
      txt = docsCount;
   
   $("#docsCountSpan").text(txt);
   $("#docsCountSpan").attr("title", "Document count: " + docsCount);
}
                      



                             
/////////////////////////////
//    QUERY INFO HANDLER   //
/////////////////////////////
var queryDivHTML =   "<div title=\"Type\">" +
                     "  <img class=\"queryDivIcons\" src=\"img/search.png\" alt=\"type icon\">" +
                     "  <span id=\"queryType\">&nbsp;</span>" +
                     "</div>" +
                     "<div title=\"Query\">" +
                     "  <img class=\"queryDivIcons\" src=\"img/query.png\" alt=\"query icon\">" +
                     "  <a id=\"queryImgLink\" href=\"#\" target=\"_blank\">&nbsp;</a>" +
                     "  <span id=\"queryTxt\">&nbsp;</span>" +
                     "</div>" +
                     "<div title=\"Searching time\">" +
                     "  <img class=\"queryDivIcons\" src=\"img/time.png\" alt=\"time icon\">" +
                     "  <span id=\"queryTime\">-</span>" +
                     "</div>" +
                     "<div title=\"Number of results\">" +
                     "  <img class=\"queryDivIcons\" src=\"img/results.png\" alt=\"result icon\">" +
                     "  <span id=\"queryNumberOfResults\">-</span>" +
                     "</div>"; 
 
 
/* It prints on the screen the query div, which contains, in order:
 *    1) the query type (visual or textual)
 *    2) the input query (link to the image or text)
 *    3) the query execution time
 *    4) the number of results.
 */
function printQueryDiv() {
   var queryDiv = $("#queryDiv");
   queryDiv.append(queryDivHTML);
   queryDiv.css("display", "block");
}


/* It clears the query div.
 */
function clearQueryDiv() {
   var queryDiv = $("#queryDiv");
   queryDiv.css("display", "none");
   queryDiv.empty();
}


/* It set the query div field with the given value. The values are:
 *       queryType                  ->       text     (VT)
 *       queryImgLink               ->       href     (V)
 *       queryTxt                   ->       text     (T)
 *       queryTime                  ->       text     (VT)
 *       queryNumberOfResults       ->       text     (VT)
 */
function setQueryDivField(field, value) {
   if(field == "queryImgLink") $("#" + field).attr("href", value);
   $("#" + field).text(value);
}





/////////////////////////////
//      GRID HANDLER       //
/////////////////////////////
/* Next, there are the parameters for the results' grid.
 * See http://getbootstrap.com/css/#grid-options.
 */
var DISPLAY = "md";     // display size
var COLUMNS = 6;        // # of columns in the grid (max 12)


/* Utility function. It is used by the showResults().
 * Given an URI as string, it creates a new HTML element - that wraps the image - and adds the latter
 * to the results' grid. 
 */      
function addImageElement(uri) {
   var imgId=uri.split("/").pop().split("_")[0];

   $(".row:last-child").append(  "<div class=\"col-" + DISPLAY + "-" + Math.floor(12/COLUMNS) + "\">" +
                                 "  <div>" +
                                 "     <img class=\"resultImg\" src=\"" + uri + "\">" +
                                 "  </div>" +
                                 "  <div>" +
                                 "     <a href=\"#\" title=\"Visual similarity search\" onclick=\"visualSearch('" + imgId + "')\"><img class=\"searchButtonImg\" src=\"img/search.png\"></a>" +
                                 "     <a href=\"" + uri + "\" target=\"_blank\" title=\"Show picture\"><img class=\"searchButtonImg\" src=\"img/show.png\"></a>" +
                                 "   </div>" +
                                 "</div>"
                              );
   
   $(document).ready(   function() {
                           $('[data-toggle="tooltip"]').tooltip();   
                        }
                  );
}


/* Utility function. It is used by the showResults().
 * It adds a new row to the results' grid.
 */
function addRow() {
   $("#resultImagesDiv").append("<div class=\"row\"></div>");
}


/* Utility function. It is used by the showResults().
 * It adds a space separator between two rows.
 */
function addSeparator() {
   $(".row:last-child").after("<div class=\"separator\"></div>");
}


/* Utility function. It is used by the showResults().
 * It clears the whole results' grid, deleting all the elements.
 */
function clearResults() {
   $("#resultImagesDiv").empty();
}   


/* Given an array containing a set of URI, i.e. the result set, it fills the results' grid with all
 * the elements belonging to the set. It is used when a visual, a random or a textual search is performed.
 */
function printResults(imgSet, start, end) {
   if(start < 0)
      return;
   
   addRow();
   for(i=start; i<end && i<imgSet.length; i++) {
      if(i!=0 && i%COLUMNS==0) {
        addSeparator();
        addRow();
      }
      addImageElement(imgSet[i]);
   }
}





/////////////////////////////
//    LOADING ANIMATION    //
/////////////////////////////
/* It shows the loading animation on the display.
 */
function showLoadingAnimation() {
   $("#loadingAnimationDiv").show();
}


/* It hides the loading animation.
 */
function hideLoadingAnimation() {
   $("#loadingAnimationDiv").hide();
}





/////////////////////////////
//        SEARCH BAR       //
/////////////////////////////
/* It shows the search bar in the navigation bar.
 */
function displaySearchBar() {
   var placeholder = ($("#visualSearchButton").parent().hasClass("active"))? "Image ID" : "Search";
   var searchInput = $("#searchBarForm input:first-of-type");
   
   searchInput.attr("placeholder", placeholder);
   searchInput.val("");
   $("#searchBarForm").show(1000);
   searchInput.focus();
}


/* It hides the search bar in the navigation bar.
 */
function hideSearchBar() {
   $("#searchBarForm").hide(1000);
}


/* It is called whenever the search button in the navigation bar is clicked.
 * Then, it executes a visual or a textual search according to the selected tab.
 */
function navBarSearch() {
   var query = $("#searchBarForm input").val();
   
   if($("#visualSearchButton").parent().hasClass("active"))
      visualSearch(query);
   else
      textualSearch(query);
}





/////////////////////////////
//       PAGINATION        //
/////////////////////////////
var ROWS_PER_PAGE = 7;


/* It prints the pagination.
 */
function printPagination(imgSet) {
   var numberOfPages = Math.ceil(imgSet.length/(ROWS_PER_PAGE*COLUMNS));
   
   var htmlTxt = "<ul class=\"pagination pagination-sm\">";
                 
   
   for(var i=0; i<numberOfPages; i++)
      htmlTxt +=  "<li>" + 
                     "<a href=\"#\" onclick=\"clearResults(); printResults(resultArray, " + i*(ROWS_PER_PAGE*COLUMNS) + ", " + (i+1)*(ROWS_PER_PAGE*COLUMNS) + ");\">" + (i+1) + "</a>" +
                  "</li>";
   
   htmlTxt += "</ul>";
   $("#paginationDiv").append(htmlTxt);
   
   $("#paginationDiv li").click(
                                 function() {
                                    $("#paginationDiv li").removeAttr("class");
                                    $(this).attr("class", "active");
                                 }
                            );
}


/* It clears the pagination div.
 */
function clearPagination() {
   $("#paginationDiv").empty();
}