/////////////////////////////
//    UTILITY FUNCTIONS    //
/////////////////////////////
/* It generates a random index belonging to the inteval [0, maxIndex].
 */
function random(maxIndex) {
   return Math.floor((Math.random() * (maxIndex + 1)));
}

/* It get a seed for random purpose, starting from the current date.
 */
function getSeed() {
   date = new Date();
   return date.getTime();
}

/* It clears an Array object, removing all the elements.
 */
Array.prototype.clear =  function() { this.length = 0; };