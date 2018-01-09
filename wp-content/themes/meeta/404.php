<?php get_header(); ?>
 
	<div id="content">
 
		<div id="main" role="main">
			
 			<div class="post">
				<div class="post-content">

			 		<h1 class="title"><?php _e('Error 404 - Nothing Found', 'wpzoom'); ?></h1>

					<div class="entry">
						<?php if ( have_posts() ) 	the_post(); ?>
	 
						<h3><?php _e('The page you are looking for could not be found.', 'wpzoom');?> </h3>
					</div><!-- / .entry -->
				</div><!-- / .post-content -->
			</div><!-- / .post -->
		</div>
		
		<?php get_sidebar(); ?>
		
	</div>
	
	<div class="clear"></div>

	<?php get_footer(); ?>