Welcome to the amazing Kyle Mathias submission for the Williams-Sonoma Coding Challenge wallapalooza! I had a lot of fun making it, so I hope you enjoy it!

How to run the code:
1.	Download the �WSCCKyleMathias� folder.
2.	Inside �WSCCKyleMathias� folder, there is a file called �index.html�. Double click that file to run my code.
Alternatively: go to my website! -> http://kylemathias.com/projects/WSCCKyleMathias/
	�I hear that Mathias boy makes a mean and clean website!� - someone great jr.

Software/imports used: Google Chrome, Notepad++, BootStrap
Tested browsers: Google Chrome, Edge and Firefox.


Features and attractions:
1.	You can change your window size to almost any desired width and the layout will change appropriately. 
2.	Item list will switch to 1 column on mobile and to 3 columns on desktop.
3.	Clicking on an image will bring you to the carousal for that image. You can exit the carousal by pressing the white x in the upper right-hand corner of the window.
4.	Item images, titles and prices are generated by the data giving in the JSON file taken for the coding challenge.
5.	Placing your cursors over images on the main page causes them to fade partially to white.
6.	When a carousal is created, the thumb nails and main image grow into place.

Code Summary:
My code takes the given JSON code for the challenge, and builds CSS, HTML and JavaScript code based on the amount of JSON object entries. You can see some examples of this in my JavaScript file(WSCCKyleMathias/js/index.js) on line 53. This loop calls functions �buildCara(integer)� and �buildStyle(integer)� witch builds individual styles, objects and carousal functions for each item giving in the JSON objects.

