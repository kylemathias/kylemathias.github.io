<?php
/**
 * The template for displaying article footers
 *
 * @since 1.0.6
 */
 ?>
	<footer class="clearfix">
	    
			<?php
			if ( is_single() ) wp_link_pages( array( 'before' => '<p id="pages">' . __( 'Pages:', 'arcade' ) ) );
			if ( is_single() ) the_tags( '<p class="tags"><i class="fa fa-tags"></i> <span>' . __( 'Tags:', 'arcade' ) . '</span>', ' ', '</p>' );
			?>
			
		
	</footer><!-- .entry -->