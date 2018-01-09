<?php 
/*-----------------------------------------------------------------------------------*/
/* Initializing Widgetized Areas (Sidebars)											 */
/*-----------------------------------------------------------------------------------*/
 
 
/*----------------------------------*/
/* Sidebar							*/
/*----------------------------------*/
 
register_sidebar(array(
    'name'=>'Sidebar',
    'id' => 'sidebar',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '<div class="clear"></div></div>',
    'before_title' => '<h3 class="title">',
    'after_title' => '</h3>',
));
 

/*----------------------------------*/
/* Footer widgetized areas			*/
/*----------------------------------*/
 
register_sidebar(array(
    'name'=>'Footer (column 1)',
    'id' => 'footer_1',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '<div class="clear"></div></div>',
    'before_title' => '<h3 class="title">',
    'after_title' => '</h3>',
));

register_sidebar(array(
    'name'=>'Footer (column 2)',
    'id' => 'footer_2',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '<div class="clear"></div></div>',
    'before_title' => '<h3 class="title">',
    'after_title' => '</h3>',
));

register_sidebar(array(
    'name'=>'Footer (column 3)',
    'id' => 'footer_3',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '<div class="clear"></div></div>',
    'before_title' => '<h3 class="title">',
    'after_title' => '</h3>',
));

register_sidebar(array(
    'name'=>'Footer (column 4)',
    'id' => 'footer_4',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '<div class="clear"></div></div>',
    'before_title' => '<h3 class="title">',
    'after_title' => '</h3>',
));

 
 
?>