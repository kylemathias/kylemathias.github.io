<?php get_header(); 
	$curauth = (isset($_GET['author_name'])) ? get_user_by('slug', $author_name) : get_userdata(intval($author));
?>

<div id="secondnav" class="clearfix">
	<div class="breadcrumbs"><h1>
			<?php /* category archive */ if (is_category()) { ?> <?php _e('Category Archives:', 'wpzoom'); ?> <strong><?php single_cat_title(); ?></strong>
			<?php /* tag archive */ } elseif( is_tag() ) { ?><?php _e('Post Tagged with:', 'wpzoom'); ?> <strong>"<?php single_tag_title(); ?>"</strong>
			<?php /* daily archive */ } elseif (is_day()) { ?><?php _e('Archive for', 'wpzoom'); ?> <strong><?php the_time('F jS, Y'); ?></strong>
			<?php /* monthly archive */ } elseif (is_month()) { ?><?php _e('Archive for', 'wpzoom'); ?> <strong><?php the_time('F, Y'); ?></strong>
			<?php /* yearly archive */ } elseif (is_year()) { ?><?php _e('Archive for', 'wpzoom'); ?> <strong><?php the_time('Y'); ?></strong>
			<?php /* author archive */ } elseif (is_author()) { ?><?php echo get_avatar( $curauth->ID , 65 ); _e( ' Author Archives: ', 'wpzoom' ); echo "<strong>$curauth->display_name </strong>"; ?>  
			<?php /* paged archive */ } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?><?php _e('Archives', 'wpzoom'); } ?>
		</h1>
	</div>
</div>

 
<div id="content">

	<div id="main" role="main">
		
		<?php get_template_part('loop'); ?>
		
	</div>
	
	<?php get_sidebar(); ?>
	
</div>

<div class="clear"></div>

<?php get_footer(); ?> 