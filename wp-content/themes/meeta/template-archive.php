<?php
/*
Template Name: Archives
*/
?>

<?php get_header(); ?>

<div id="secondnav" class="clearfix">
	<span><?php _e('Popular Tags:', 'wpzoom'); ?></span>
	<ul>
		<?php wp_list_categories('show_count=1&number=8&title_li=&orderby=count&order=DESC&taxonomy=post_tag'); ?>
	</ul>
</div>

<div id="content">

	<div id="main">

			<div class="post">
		
			<div class="post-content">
		
				<h1 class="title">
					<a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s', 'wpzoom' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><?php the_title(); ?></a>
				</h1>
				
				<?php edit_post_link( __('Edit', 'wpzoom'), '<div class="top-meta clearfix"><span>', '</span></div>'); ?>	
		 
				<div class="entry" id="archives">

					<?php
						query_posts('posts_per_page=-1');
						$dates_array 			   = Array();
						$year_array 			   = Array();
						$i 				           = 0;
						$prev_post_ts    		 = null;
						$prev_post_year  		 = null;
						$distance_multiplier =  9;
						?>


					<?php
					while ( have_posts() ) :

						the_post();

						$post_ts   = strtotime($post->post_date);
						$post_year = date( 'Y', $post_ts );

						if ( is_null( $prev_post_year ) ) {

							?><h3 class="archive_year"><?php echo $post_year; ?></h3>
							<ul class="archives_list"><?php

						} else if ( $prev_post_year != $post_year ) {

							/* Close off the OL */
							?></ul><?php

							$working_year = $prev_post_year;

							/* Print year headings until we reach the post year */
							while ( $working_year > $post_year ) {

								$working_year--;
								?><h3 class="archive_year"><?php echo $working_year; ?></h3><?php

							}

							/* Open a new ordered list */
							?><ul class="archives_list"><?php

						}

						/* Compute difference in days */
						if ( ! is_null( $prev_post_ts ) && $prev_post_year == $post_year ) {
							$dates_diff  =  ( date( 'z', $prev_post_ts ) - date( 'z', $post_ts ) ) * $distance_multiplier;
						} else {
							$dates_diff  =  0;
						}

						?><li><span class="date"><?php the_time( 'M j' ); ?><sup><?php the_time( 'S') ?></sup></span> <span class="linked"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></span> <span class="comments"><?php comments_popup_link(__( '0', 'wpzoom' ), __( '1', 'wpzoom' ), __( '%', 'wpzoom' ), '', '0'); ?></span></li><?php

						/* For subsequent iterations */
						$prev_post_ts    =  $post_ts;
						$prev_post_year  =  $post_year;

					endwhile;

					/* If we've processed at least *one* post, close the ordered list */
					if ( ! is_null( $prev_post_ts ) ) {
						?></ul><?php
					}
					?>

					<div class="clear"></div>

				</div><!-- / .entry -->

				<div class="clear"></div>
		 
			</div><div class="clear"></div><!-- .post-content -->
 
		
		</div><!-- .post-->
		<div class="clear"></div>
 			 
	</div><!-- /#main -->
		
	<?php get_sidebar();  ?>
	 
</div><!-- /#content -->
<div class="clear"></div>

<?php get_footer(); ?>