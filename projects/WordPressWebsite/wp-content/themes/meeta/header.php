<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>
<head>
    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
   
    <title><?php ui::title(); ?></title>

    <link rel="stylesheet" type="text/css" href="<?php bloginfo('stylesheet_url'); ?>" media="screen" />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

    <?php wp_head(); ?>
</head>
<body <?php body_class() ?>>

<div class="wrap wide">
    <header id="header">        
        <div id="logo">
			<?php if (!option::get('misc_logo_path')) { echo "<h1>"; } ?>
			
			<a href="<?php bloginfo('url'); ?>" title="<?php bloginfo('description'); ?>">
				<?php if (!option::get('misc_logo_path')) { bloginfo('name'); } else { ?>
					<img src="<?php echo ui::logo(); ?>" alt="<?php bloginfo('name'); ?>" />
				<?php } ?>
			</a>
			
			<?php if (!option::get('misc_logo_path')) { echo "</h1>"; } ?>
		</div><!-- / #logo -->
        
		<div id="navbar"> 
            <?php if (has_nav_menu( 'primary' )) { 
				wp_nav_menu(array(
				'container' => 'menu',
				'container_class' => '',
				'menu_class' => 'dropdown',
				'menu_id' => 'mainmenu',
				'sort_column' => 'menu_order',
				'theme_location' => 'primary'
				));
			}					
			else
				{
					echo '<p>Please set your Top navigation menu on the <strong><a href="'.get_admin_url().'nav-menus.php">Appearance > Menus</a></strong> page.</p>
				 ';
				}
            ?>
		</div><!-- /#navbar -->
        
        <div class="clear"></div>
        
        <?php
			// Check to see if the header image has been removed
			$header_image = get_header_image();
			if ( ! empty( $header_image ) ) :
		?>
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<img src="<?php header_image(); ?>" width="<?php echo HEADER_IMAGE_WIDTH; ?>" height="<?php echo HEADER_IMAGE_HEIGHT; ?>" alt="" />
 		</a>
		<?php endif; // end check for removed header image ?>
 
     </header>