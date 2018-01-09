<?php get_header(); ?>

<div id="secondnav" class="clearfix">
	<span><?php _e('Popular Tags:', 'wpzoom'); ?></span>
	<ul>
		<?php wp_list_categories('show_count=1&number=8&title_li=&orderby=count&order=DESC&taxonomy=post_tag'); ?>
	</ul>
</div>

<div id="content">

	<div id="main">

		<?php while (have_posts()) : the_post(); ?>

			<div class="post">
			
				<div class="post-content">
			
					<h1 class="title">
						<a href="<?php the_permalink(); ?>" title="<?php printf( esc_attr__( 'Permalink to %s', 'wpzoom' ), the_title_attribute( 'echo=0' ) ); ?>" rel="bookmark"><?php the_title(); ?></a>
					</h1>
					
					<?php edit_post_link( __('Edit', 'wpzoom'), '<div class="top-meta clearfix"><span>', '</span></div>'); ?>	
			 
					<div class="entry">
						<?php the_content(); ?>
						<div class="clear"></div>
						<?php wp_link_pages( array( 'before' => '<div class="page-link"><span>' . __( 'Pages:', 'wpzoom' ) . '</span>', 'after' => '</div>' ) ); ?>
						<div class="clear"></div>
					</div><!-- .entry -->
					<div class="clear"></div>
			 
				</div><div class="clear"></div><!-- .post-content -->
	 
			
			</div><!-- .post-->
			<div class="clear"></div>
			
			<?php if (option::get('comments_page') == 'on') { 
				comments_template();  
				} ?>
			
			<?php endwhile; ?>
	
	</div><!-- /#main -->
		
	<?php get_sidebar();  ?>
	 
</div><!-- /#content -->
<div class="clear"></div>

<?php get_footer(); ?>