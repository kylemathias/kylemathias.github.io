<?php
 
	while (have_posts()) : the_post();  ?>
 
	<div id="post-<?php the_ID(); ?>" class="post clearfix">
		<div class="post-content">

			<h2 class="title"><a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s', 'wpzoom' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><?php the_title(); ?></a></h2>
			
			<div class="top-meta">
 				<?php if (option::get('display_date') == 'on') { ?><span class="date"><?php printf( __('%s at %s', 'wpzoom'),  get_the_date(), get_the_time()); ?></span><?php } ?>
 				<?php edit_post_link( __('Edit', 'wpzoom'), '<span>', '</span>'); ?>
  			</div><div class="clear"></div>
 			
			<div class="entry">
				<?php if (option::get('display_content') == 'Full Content') {  the_content(''); } else { the_excerpt(); } ?>
  		 		
  		 		<div class="clear"></div> 
			</div><!-- /.entry -->
		</div><!-- /.post-content -->
		<div class="clear"></div>

		<div class="post-meta clearfix">	
		
			<?php if (option::get('display_share') == 'on') { ?>
				<span class="tw_btn"><a href="http://twitter.com/share" data-url="<?php the_permalink() ?>" data-text="<?php the_title(); ?>" class="twitter-share-button" data-count="horizontal">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></span>
				
				<span class="fb_btn"><iframe src="http://www.facebook.com/plugins/like.php?href=<?php echo urlencode(get_permalink($post->ID)); ?>&amp;layout=button_count&amp;show_faces=false&amp;width=1000&amp;action=like&amp;font=arial&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:80px; height:21px;" allowTransparency="true"></iframe></span>
				
			<?php } ?>
			
			<?php if (option::get('display_readmore') == 'on') { ?><span class="readmore"><a href="<?php the_permalink() ?>"><?php _e('Read more', 'wpzoom'); ?></a></span><?php } ?>			

			<?php if (option::get('display_comments') == 'on') { ?><?php comments_popup_link( '0', '1', '%', 'comments', __('Comments Off', 'wpzoom')); ?><?php } ?>
  			
  		</div>
		
	</div><!-- #post-<?php the_ID(); ?> -->
	
 
<?php endwhile; ?>
<?php get_template_part( 'pagination'); ?>
<?php wp_reset_query(); ?>