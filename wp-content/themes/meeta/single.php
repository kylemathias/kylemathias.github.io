<?php get_header(); ?>
<?php $template = get_post_meta($post->ID, 'wpzoom_post_template', true); ?>

	<div id="secondnav" class="clearfix">
		<div class="breadcrumbs"><?php _e('You are here:', 'wpzoom'); ?> <?php wpzoom_breadcrumbs(); ?></div>
 	</div>

	<div id="content"<?php 
		  if ($template == 'side-left') {echo " class=\"side-left\"";}
		  if ($template == 'full') {echo " class=\"full-width\"";} 
		  ?>>

		<div id="main">
				
			<?php while (have_posts()) : the_post(); ?>
					
				<div id="post-<?php the_ID(); ?>" class="post clearfix">
				
					<div class="post-content">
				
						<h1 class="title"><a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s', 'wpzoom' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><?php the_title(); ?></a></h1>
						
						<div class="top-meta clearfix">
							<?php if (option::get('post_date') == 'on') { ?><span><?php printf( __('%s at %s', 'wpzoom'),  get_the_date(), get_the_time()); ?></span><?php } ?>
 							<?php edit_post_link( __('Edit', 'wpzoom'), '<span> / ', '</span>'); ?>
						</div> 
						 
						<div class="entry">
							<?php the_content(); ?>
							<div class="clear"></div>
							<?php wp_link_pages( array( 'before' => '<div class="page-link"><span>' . __( 'Pages:', 'wpzoom' ) . '</span>', 'after' => '</div>' ) ); ?>
							<div class="clear"></div>
						</div><!-- / .entry -->
						<div class="clear"></div>
						
						<?php the_tags( '<div class="tags_list">Tags: ', ' ', '</div>'); ?>
						
						<?php if (option::get('post_share') == 'on') { ?>
							<div class="share_btn clearfix">
								<h4><?php _e('Share:', 'wpzoom'); ?></h4>
								<span class="tw_btn"><a href="http://twitter.com/share" data-url="<?php the_permalink() ?>" data-text="<?php the_title(); ?>" class="twitter-share-button" data-count="horizontal">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></span>
								
								<span class="fb_btn"><iframe src="http://www.facebook.com/plugins/like.php?href=<?php echo urlencode(get_permalink($post->ID)); ?>&amp;layout=button_count&amp;show_faces=false&amp;width=1000&amp;action=like&amp;font=arial&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:80px; height:21px;" allowTransparency="true"></iframe></span>
 							</div>
						<?php } ?>
					
					</div><!-- / .post-content -->
					<div class="clear"></div>
					
 			
 
					<?php if (option::get('post_author') == 'on') { ?>
						<div class="post_author">
							<?php echo get_avatar( get_the_author_meta('ID'), 70 ); ?>
							<span><?php _e('Author:', 'wpzoom'); ?> <?php the_author_posts_link(); ?></span>
							<?php the_author_meta('description'); ?><div class="clear"></div>
						</div>
					<?php } ?>
				
 				</div><!-- / #post-<?php the_ID(); ?> -->
 			 
				<div class="clear"></div>
				
				<?php comments_template(); ?>
				
			<?php endwhile; ?>
 
 		</div><!-- /#main -->
		
		<?php if ($template != 'full') { 
		get_sidebar(); 
		} ?>
		
	</div><!-- /#content -->
	
	<div class="clear"></div>

<?php get_footer(); ?> 