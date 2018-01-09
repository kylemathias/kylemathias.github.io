<?php get_header(); ?>
 
<div id="secondnav" class="clearfix">
	<span><?php _e('Popular Tags:', 'wpzoom'); ?></span>
	<ul>
		<?php wp_list_categories('show_count=1&number=8&title_li=&orderby=count&order=DESC&taxonomy=post_tag'); ?>
	</ul>
</div>


<div id="content">

	<div id="main" role="main">
		<?php get_template_part('loop'); ?>
	</div>
	
	<?php get_sidebar(); ?>
	
</div>
<div class="clear"></div>

<?php get_footer(); ?> 