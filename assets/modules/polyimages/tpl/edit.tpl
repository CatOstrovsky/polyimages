<!DOCTYPE html>
<html>
<head>
	<title>Edit Polyimages</title>

	<script src="/assets/modules/polyimages/src/libs/jquery/jquery-3.3.1.min.js" type="text/javascript"></script>		
	<script src="/assets/modules/polyimages/src/libs/svg.cordinator/svg.min.js"></script>

	<script src="/assets/modules/polyimages/src/libs/svg.cordinator/svg.draw.min.js"></script>
	<script src="/assets/modules/polyimages/src/libs/svg.cordinator/svg.select.min.js"></script>
	<script src="/assets/modules/polyimages/src/libs/svg.cordinator/svg.resize.min.js"></script>
	<script src="/assets/modules/polyimages/src/libs/svg.cordinator/svg.panzoom.min.js"></script>
	<script src="/assets/modules/polyimages/src/libs/svg.cordinator/svg.draggable.min.js"></script>

	<script src="/assets/modules/polyimages/src/libs/svg.cordinator/svg.cordinator.jquery.js?[+hash+]"></script>
	<link rel="stylesheet" href="/assets/modules/polyimages/src/libs/svg.cordinator/svg.cordinator.css?[+hash+]">

</head>
<body>

	<script>
		var objects = [];
		objects = [+objects+];
	</script>

	<nav class="navigation">
		<ul>
			<li><a href="#" id="circle">[+circle+]</a></li>
			<li><a href="#" id="rect">[+rectagle+]</a></li>
			<li><a href="#" id="polygon">[+polygon+]</a></li>
		</ul>
	</nav>
	<!-- <div id="watcher"></div> -->

	<div class="svg-cord">
		<img src="[+image+]" alt="">
	</div>


	<div class="edit-modal" style="display: none;">
		
		<p class="edit-modal_title">[+edit_two+]</p>
	
		<a href="#" class="close-modal"></a>

		<ul class="edit-modal_title_tabs_header">
			<li><a href="#tab_balun" class="active">[+balloon+]</a></li>
			<li><a href="#tab_colors">[+color_settings+]</a></li>
		</ul>
		<form id="settings_form">
			<div class="tab active" id="tab_balun">

				<p class="caption_field">[+active_balloon+]</p>
				<input type="checkbox" name="balloon_active" value="1">

				<p class="caption_field">[+position_balloon+]</p>
				<select class="field" name="balloon_position">
					<option value="t">[+top+]</option>
					<option value="l">[+left+]</option>
					<option value="b">[+bottom+]</option>
					<option value="r">[+right+]</option>
				</select>
				
				<p class="caption_field">[+balloon+]</p>
				<textarea name="balloon" cols="30" rows="10"></textarea>

			</div>
			<div class="tab" id="tab_colors">
				<p class="caption_field">[+use_custom_colors+]</p>
				<input type="checkbox" name="colors_active" value="1">

				<p class="caption_field">[+default_bg_color+]</p>
				<input type="color" class="field" name="fill_default">

				<p class="caption_field">[+hover_bg_color+]</p>
				<input type="color" class="field" name="fill_hover">
		
				<p class="caption_field">[+default_stroke_color+]</p>
				<input type="color" class="field" name="stroke_default">

				<p class="caption_field">[+hover_stroke_color+]</p>
				<input type="color" class="field" name="stroke_hover">

			</div>
		</form>

		<a href="#" class="cancel-edit">[+cancel+]</a>
		<a href="#" class="save-edit">[+save+]</a>
	</div>
	
	<script>
		var cordinator = {};

		jQuery(document).ready(function($) {
			cordinator = $(".svg-cord").svgCordinator({
				responsive: true,
				controls: {
					circle: "#circle",
					rect: "#rect",
					polygon: "#polygon"
				},
				nav: true,
				// watcher: {
				// 	el: "#watcher",
				// 	template: "#x#, #y#"
				// }
			}).init();
			cordinator.canvas.image("[+image+]");
			if (typeof(objects) == "object")  cordinator.setData(objects);


			$("body").on('click', '.edit-modal_title_tabs_header a', function(event) {
				event.preventDefault();
				$(".tab").removeClass('active');
				$('.edit-modal_title_tabs_header a').removeClass('active');
				$($(this).attr("href")).addClass('active');
				$(this).addClass('active');
			});

			$("body").on('click', '.cancel-edit, .close-modal', function(event) {
				event.preventDefault();
				$(".edit-modal").fadeOut(300);
			});
		});
	</script>


</body>
</html>