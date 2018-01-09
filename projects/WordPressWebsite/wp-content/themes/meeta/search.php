<?php get_header(); ?>
 
<div id="secondnav" class="clearfix">
	<div class="breadcrumbs">
		<h1><?php _e('Search Results for','wpzoom');?> <strong>"<?php the_search_query(); ?>"</strong> <?php $total_results = $wp_query->found_posts; echo ": " .$total_results. " "; ?></h1>
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