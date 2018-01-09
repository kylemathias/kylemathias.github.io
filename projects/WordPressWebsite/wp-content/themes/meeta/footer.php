 
	<div id="footer">
		<?php if ( is_active_sidebar( 'footer_1'  ) ||  is_active_sidebar( 'footer_2'  )  ||  is_active_sidebar( 'footer_3'  ) ) : ?>
			<div class="widgetized">
		<?php endif; ?>
  			
			<div class="column">
				<?php if (function_exists('dynamic_sidebar')) { dynamic_sidebar('Footer (column 1)'); } ?>
			</div><!-- / .column -->
			
			<div class="column">
				<?php if (function_exists('dynamic_sidebar')) { dynamic_sidebar('Footer (column 2)'); } ?>
			</div><!-- / .column -->
			
			<div class="column">
				<?php if (function_exists('dynamic_sidebar')) { dynamic_sidebar('Footer (column 3)'); } ?>
			</div><!-- / .column -->
			
			<div class="column last">
				<?php if (function_exists('dynamic_sidebar')) { dynamic_sidebar('Footer (column 4)'); } ?>
			</div><!-- / .column -->
 
		<?php if ( is_active_sidebar( 'footer_1'  ) ||  is_active_sidebar( 'footer_2'  )  ||  is_active_sidebar( 'footer_3'  ) ) : ?>
			<div class="clear"></div>
        </div>
		<?php endif; ?> 
        
        <div class="copyright">
			<div class="left">
				<?php _e('Copyright', 'wpzoom'); ?> &copy; <?php echo date("Y",time()); ?> <?php bloginfo('name'); ?>. <?php _e('All Rights Reserved', 'wpzoom'); ?>.
			</div>
			
			<div class="right">
				<p class="wpzoom"><a href="http://www.wpzoom.com" target="_blank" title="Premium WordPress Themes"><img src="<?php bloginfo('template_directory'); ?>/images/wpzoom.png" alt="WPZOOM" /></a> <?php _e('Designed by', 'wpzoom'); ?></p>
			</div>
			
		</div><!-- /.copyright -->
 
    </div>
 
</div><!-- /.wrap /.wide -->

<?php wp_footer(); ?>
</body>
</html>