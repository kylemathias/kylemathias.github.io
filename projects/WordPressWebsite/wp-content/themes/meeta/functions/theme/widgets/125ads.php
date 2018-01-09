<?php

/*------------------------------------------*/
/* WPZOOM: 125x125 Ads                      */
/*------------------------------------------*/
 
class WPZOOM_125x125_Ads_Widget extends WP_Widget {

	function __construct() {
		parent::__construct('wpzoom-125x125-ads', __('WPZOOM: 125x125 Ads', 'wpzoom'), array('description' => __('Allows you to place sections of 125x125 ads in your theme.', 'wpzoom')));
	}

	function widget($args, $instance) {
		extract($args);

		$title = isset($instance['title']) && !empty($instance['title']) ? apply_filters('widget_title', $instance['title']) : '';
		$ads = isset($instance['ads']) && is_array($instance['ads']) ? $instance['ads'] : array();

		echo $before_widget;
		echo $before_title . $title . $after_title;
		echo '<ul>';

		foreach($ads as $ad) {
 			$out = sprintf('<img src="%s" height="125" width="125" alt="%s" />', esc_url($ad['imgurl']), $title);

			if(isset($ad['targeturl']) && !empty($ad['targeturl']))
				$out = sprintf('<a href="%s">%s</a>', esc_url($ad['targeturl']), $out);

			echo '<li>' . $out . '</li>';
		}

		echo '</ul>' . $after_widget;
	}

	function form($instance) {
		$ads = isset($instance['ads']) && is_array($instance['ads']) && !empty($instance['ads']) ? $instance['ads'] : array();
		?>

		<p>
			<label for="<?php echo $this->get_field_id('title') ?>"><?php _e('Title:', 'wpzoom') ?></label> 
			<input type="text" size="35" id="<?php echo $this->get_field_id('title') ?>" name="<?php echo $this->get_field_name('title') ?>" value="<?php echo isset($instance['title']) ? esc_attr($instance['title']) : __('Advertisements', 'wpzoom') ?>" class="widefat" />
		</p>

		<div class="wpzoom-sub-widgets">
			<?php if(empty($ads)) echo '<p class="wpzoom-sub-widgets-empty"><em>' . __('No ad slots&hellip;', 'wpzoom') . '</em></p>';

			foreach($ads as $i=>$ad) { $i++; ?>
				<div class="widget">
					<div class="widget-top">
						<div class="widget-title-action"><a class="widget-action hide-if-no-js" href="#available-widgets"></a></div>
						<div class="widget-title"><h4><?php printf(__('Ad Slot #%d', 'wpzoom'), $i) ?></h4></div>
					</div>

					<div class="widget-inside">
						<p>
							<label for="<?php echo $this->get_field_id('ad'.$i.'-imgurl') ?>"><?php _e('Image Source:', 'wpzoom') ?></label> 
							<input type="text" size="35" id="<?php echo $this->get_field_id('ad'.$i.'-imgurl') ?>" name="<?php echo $this->get_field_name('ads]['.$i.'][imgurl') ?>"<?php echo isset($ad['imgurl']) ? ' value="'.esc_attr($ad['imgurl']).'"' : '' ?> class="widefat" />
						</p>

						<p>
							<label for="<?php echo $this->get_field_id('ad'.$i.'-targeturl') ?>"><?php _e('Target URL:', 'wpzoom') ?></label> 
							<input type="text" size="35" id="<?php echo $this->get_field_id('ad'.$i.'-targeturl') ?>" name="<?php echo $this->get_field_name('ads]['.$i.'][targeturl') ?>"<?php echo isset($ad['targeturl']) ? ' value="'.esc_attr($ad['targeturl']).'"' : '' ?> class="widefat" />
						</p>

						<div class="widget-control-actions">
							<div class="alignleft">
								<a class="wpzoom-widget-control-remove" href="#remove"><?php _e('Delete', 'wpzoom') ?></a> |
								<a class="widget-control-close" href="#close"><?php _e('Close', 'wpzoom') ?></a>
							</div>
							<br class="clear" />
						</div>
					</div>
				</div>
			<?php } ?>
		</div>

		<p><a class="button wpzoom-widget-control-addnew" href="#addnew"><img src="<?php echo wpzoom::$assetsPath ?>/images/ico-add.png" height="16" width="16" alt="+" /> <?php _e('Add Ad Slot', 'wpzoom') ?></a></p>

		<?php
	}

	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		$instance['title'] = isset($new_instance['title']) ? strip_tags(trim($new_instance['title'])) : '';
		$instance['ads'] = array();

		if(isset($new_instance['ads']) && is_array($new_instance['ads'])) {
			foreach($new_instance['ads'] as $ad) {
				$temp = array();

				if(isset($ad['imgurl']) && '' != ($imgurl=trim($ad['imgurl'])))
					$temp['imgurl'] = filter_var($imgurl, FILTER_SANITIZE_URL);

				if(isset($ad['targeturl']) && '' != ($targeturl=trim($ad['targeturl'])))
					$temp['targeturl'] = filter_var($targeturl, FILTER_SANITIZE_URL);

				if(!empty($temp))
					$instance['ads'][] = $temp;
			}
		}

		return $instance;
	}

}

function wpzoom_widgets_admin_head() {
	?>

	<style type="text/css">
		.wpzoom-sub-widgets {
			margin: 2em 0;
		}

		.wpzoom-sub-widgets .widget {
			width: auto;
		}

		.wpzoom-sub-widgets .widget:last-child {
			margin-bottom: 0;
		}

		.wpzoom-sub-widgets .widget .widget-top {
			cursor: auto;
		}

		.wpzoom-sub-widgets-empty {
			text-align: center;
			color: #666;
			padding: 5px !important;
			border: 1px dashed #666;
		}

		.wpzoom-widget-control-addnew img {
			vertical-align: middle;
		}
	</style>

	<?php
}

function wpzoom_widgets_admin_footer() {
	?>

	<script type="text/javascript">
		jQuery(function($){
			$('.wpzoom-sub-widgets .wpzoom-widget-control-remove').live('click', function(e){
				e.preventDefault();

				$(this).closest('.widget').slideUp('slow', function(){
					var $widgets = $(this).closest('.wpzoom-sub-widgets');

					$(this).remove();

					if($('.widget', $widgets).size() <= 0) {
						$('<p class="wpzoom-sub-widgets-empty"><em><?php _e('No ad slots&hellip;', 'wpzoom') ?></em></p>').prependTo($widgets);
					} else {
						$('.widget', $widgets).each(function(i){
							$('.widget-title h4', $(this)).html('<?php _e('Ad Slot #', 'wpzoom') ?>' + (i + 1));
						});
					}
				});

				return false;
			});

			$('.wpzoom-widget-control-addnew').live('click', function(e){
				e.preventDefault();

				var instance = $(this).closest('.widget').attr('id').split('-').pop(),
						$widgets = $(this).parent().parent().find('.wpzoom-sub-widgets'),
						amount = $('.widget', $widgets).size(),
						newAdId = amount + 1,
						inputIdPrefix = 'widget-wpzoom-125x125-ads-' + instance + '-ad' + newAdId + '-',
						inputNamePrefix = 'widget-wpzoom-125x125-ads[' + instance + '][ads][' + newAdId + '][';

				if(amount < 1) $widgets.empty();

				$('<div class="widget">' +
						'<div class="widget-top">' +
							'<div class="widget-title-action"><a class="widget-action hide-if-no-js" href="#available-widgets"></a></div>' +
							'<div class="widget-title"><h4><?php _e('Ad Slot #', 'wpzoom') ?>' + newAdId + '</h4></div>' +
						'</div>' +

						'<div class="widget-inside" style="display:block">' +
							'<p>' +
								'<label for="' + inputIdPrefix + 'imgurl"><?php _e('Ad Image URL:', 'wpzoom') ?></label> ' +
								'<input type="text" size="35" id="' + inputIdPrefix + 'imgurl" name="' + inputNamePrefix + 'imgurl]" class="widefat" />' +
							'</p>' +

							'<p>' +
								'<label for="' + inputIdPrefix + 'targeturl"><?php _e('Target URL:', 'wpzoom') ?></label> ' +
								'<input type="text" size="35" id="' + inputIdPrefix + 'targeturl" name="' + inputNamePrefix + 'targeturl]" class="widefat" />' +
							'</p>' +

							'<div class="widget-control-actions">' +
								'<div class="alignleft">' +
									'<a class="wpzoom-widget-control-remove" href="#remove"><?php _e('Delete', 'wpzoom') ?></a> | ' +
									'<a class="widget-control-close" href="#close"><?php _e('Close', 'wpzoom') ?></a>' +
								'</div>' +
								'<br class="clear" />' +
							'</div>' +
						'</div>' +
					'</div>').appendTo($widgets).hide().slideDown('slow');

				return false;
			});
		});
	</script>

	<?php
}

add_action('widgets_init', create_function('','register_widget("WPZOOM_125x125_Ads_Widget");'));
add_action('admin_head-widgets.php', 'wpzoom_widgets_admin_head', 99999);
add_action('admin_footer-widgets.php', 'wpzoom_widgets_admin_footer', 99999);

?>