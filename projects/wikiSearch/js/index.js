/* jshint browser: true */
/* jshint unused:false */
/* eslint-env browser */
/* exported searchWiki offClick setWidth */
var input = document.getElementById("mySearch");
input.addEventListener("keyup", function (event) {
    "use strict";
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("myBtn").click();

    }
});

function searchWiki() {
    "use strict";
    var searchText = document.getElementById("mySearch").value,
        newWidth;
    
    if (searchText.length === 0) {
        document.getElementById("mySearch").style.width = "150px";
    } else {
        newWidth = "" + ((searchText.length + 5) * 13.8);
        document.getElementById("mySearch").style.width = newWidth + "px";
    }
    //take search box current elements
    document.getElementById("demo").innerHTML = searchText;
    //clear the current focus
    document.activeElement.blur(); 
}

function offClick() {
    "use strict";
    var searchText = document.getElementById("mySearch").value,
        newWidth;
    
    if (searchText.length === 0) {
        document.getElementById("mySearch").style.width = "150px";
    } else {
        newWidth = "" + ((searchText.length + 5) * 13.8);
        document.getElementById("mySearch").style.width = newWidth + "px";
    }
}

function setWidth() {
    "use strict";
    document.getElementById("mySearch").style.width = "100%";
}
