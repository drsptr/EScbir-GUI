/////////////////////////////
//          GENERAL        //
/////////////////////////////
/* It sets the just clicked item on the navbar in the active state. When the user clicks on an item
 * on the navbar, its color becames darker.
 */
$("ul.nav.navbar-nav a").click(  function() {
                                    $("ul.nav.navbar-nav li").removeAttr("class");
                                    $(this).parent().attr("class", "active");
                                 }
                              );
                              



                              
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
   imgId=uri.split("/").pop().split("_")[0];

   $(".row:last-child").append(  "<div class=\"col-" + DISPLAY + "-" + Math.floor(12/COLUMNS) + "\">" +
                                 "   <div>" +
                                 "      <img class=\"resultImg\" src=\"" + uri + "\">" +
                                 "   </div>" +
                                 "   <div>" +
                                 "      <a href=\"#\" title=\"Visual similarity search\" onclick=\"alert('" + imgId + "')\"><img class=\"searchButtonImg\" src=\"img/search.png\"></a>" +
                                 "      <a href=\"" + uri + "\" target=\"_blank\" title=\"Show picture\"><img class=\"searchButtonImg\" src=\"img/show.png\"></a>" +
                                 "   </div>" +
                                 "</div>"
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
var arrayImg = new Array();
   arrayImg[0] = "http://farm5.staticflickr.com/4137/4888431878_5470a5578b.jpg";
   arrayImg[1] = "http://farm3.staticflickr.com/2872/13266135434_c2d719f79c.jpg";
   arrayImg[2] = "http://farm9.staticflickr.com/8231/8570711349_8c98474b68.jpg";
   arrayImg[3] = "http://farm5.staticflickr.com/4052/4338993037_f673938de1.jpg";
   arrayImg[4] = "http://farm7.staticflickr.com/6002/5970121149_6203ed5514.jpg";
   arrayImg[5] = "http://farm2.staticflickr.com/1258/1134707013_7cfc6718ef.jpg";
   
   arrayImg[6] = "http://farm1.staticflickr.com/42/76425570_0ddcef5d8f.jpg";
   arrayImg[7] = "http://farm5.staticflickr.com/4016/5074023593_f7d5c2b913.jpg";
   arrayImg[8] = "http://farm9.staticflickr.com/8010/7368127674_e9b97c8014.jpg";
   arrayImg[9] = "http://farm5.staticflickr.com/4086/5079866272_0038ecaffb.jpg";
   arrayImg[10] = "http://farm9.staticflickr.com/8444/7844523280_10e0b8ae42.jpg";
   arrayImg[11] = "http://farm6.staticflickr.com/5066/5829328836_3c7fc463cf.jpg";
   
   arrayImg[12] = "http://farm7.staticflickr.com/6240/6319960852_aa2fc75fdf.jpg";
   arrayImg[13] = "http://farm1.staticflickr.com/88/270804036_688e6c6b2b.jpg";
   arrayImg[14] = "http://farm5.staticflickr.com/4150/4994274310_b5b1bd0f3c.jpg";
   arrayImg[15] = "http://farm5.staticflickr.com/4126/5063982949_c121769ab4.jpg"; 
 
function showResults(imgSet) {
   addRow();
   for(i=0; i<imgSet.length; i++) {
      if(i!=0 && i%COLUMNS==0) {
        addSeparator();
        addRow();
      }
      addImageElement(imgSet[i]);
   }
}

showResults(arrayImg);