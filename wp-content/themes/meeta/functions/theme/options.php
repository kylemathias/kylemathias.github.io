<?php return array(


/* Theme Admin Menu */
"menu" => array(
    array("id"    => "1",
          "name"  => "General"),
           
  	array("id"    => "5",
          "name"  => "Styling"),
 
),

/* Theme Admin Options */
"id1" => array(
    array("type"  => "preheader",
          "name"  => "Theme Settings"),
 
	array("name"  => "Logo Image",
          "desc"  => "Upload a custom logo image for your site, or you can specify an image URL directly.",
          "id"    => "misc_logo_path",
          "std"   => "",
          "type"  => "upload"),

    array("name"  => "Favicon URL",
          "desc"  => "Upload a favicon image (16&times;16px).",
          "id"    => "misc_favicon",
          "std"   => "",
          "type"  => "upload"),
          
    array("name"  => "Custom Feed URL",
          "desc"  => "Example: <strong>http://feeds.feedburner.com/wpzoom</strong>",
          "id"    => "misc_feedburner",
          "std"   => "",
          "type"  => "text"),

 	array("name"  => "Enable comments for static pages",
          "id"    => "comments_page",
          "std"   => "off",
          "type"  => "checkbox"),
 
           
 	array("type"  => "preheader",
          "name"  => "Global Posts Options"),
	
	array("name"  => "Content",
          "desc"  => "Number of posts displayed on homepage can be changed <a href=\"options-reading.php\" target=\"_blank\">here</a>.",
          "id"    => "display_content",
          "options" => array('Full Content', 'Excerpt'),
          "std"   => "Full Content",
          "type"  => "select"),
     
    array("name"  => "Excerpt length",
          "desc"  => "Default: <strong>50</strong> (words)",
          "id"    => "excerpt_length",
          "std"   => "50",
          "type"  => "text"),
          
  	array("name"  => "Display Date/Time",
          "desc"  => "<strong>Date/Time format</strong> can be changed <a href='options-general.php' target='_blank'>here</a>.",
          "id"    => "display_date",
          "std"   => "on",
          "type"  => "checkbox"),  
  
	array("name"  => "Display Comments Count",
          "id"    => "display_comments",
          "std"   => "on",
          "type"  => "checkbox"),  
          
    array("name"  => "Display Read More link",
          "id"    => "display_readmore",
          "std"   => "on",
          "type"  => "checkbox"),
  
	array("name"  => "Display Sharing Buttons",
          "id"    => "display_share",
          "std"   => "on",
          "type"  => "checkbox"),
          
          
	array("type"  => "preheader",
          "name"  => "Single Post Options"),
          
	array("name"  => "Display Date/Time",
          "desc"  => "<strong>Date/Time format</strong> can be changed <a href='options-general.php' target='_blank'>here</a>.",
          "id"    => "post_date",
          "std"   => "on",
          "type"  => "checkbox"),  
           
	array("name"  => "Display Sharing Buttons",
          "id"    => "post_share",
          "std"   => "on",
          "type"  => "checkbox"),
          
    array("name"  => "Display Author Info",
          "desc"  => "You can edit your profile on this <a href='profile.php' target='_blank'>page</a>.",
          "id"    => "post_author",
          "std"   => "on",
          "type"  => "checkbox"),
   
),
 
 
"id5" => array(
	array("type"  => "preheader",
          "name"  => "Colors"),
          
	array("name"  => "Main Text Color",
		   "id"   => "text_css_color",
           "type" => "color",
           "selector" => "body",
           "attr" => "color"),
           
	array("name"  => "Post Title Color",
		   "id"   => "title_css_color",
           "type" => "color",
           "selector" => ".post h2.title a, .post h1.title a",
           "attr" => "color"),
           
	array("name"  => "Post Title Hover Color",
		   "id"   => "title_hover_css_color",
           "type" => "color",
           "selector" => ".post h2.title a:hover, .post h1.title a:hover",
           "attr" => "color"),
 
	array("name"  => "Links Color",
		   "id"   => "a_css_color",
           "type" => "color",
           "selector" => "a",
           "attr" => "color"),
           
	array("name"  => "Links Hover Color",
		   "id"   => "ahover_css_color",
           "type" => "color",
           "selector" => "a:hover",
           "attr" => "color"),
 
 	array("name"  => "Widget Title Color",
		   "id"   => "widget_css_color",
           "type" => "color",
           "selector" => ".widget h3.title ",
           "attr" => "color"),
  
 ), 

/* end return */);