jQuery(document).ready(function($) {

	function getId() {
		var rand = "polyimg_"+parseInt(Math.random()*123219513);
		if($("#"+rand).length) rand = getId();
		return rand;
	}

	var defaultConfig = {
		balloon:"",
		balloon_active:"0",
		balloon_position:"",
		colors_active:"0",
		fill_default:"#fff",
		fill_hover:"#000",
		stroke_default:"#000",
		stroke_hover:"#000"
	};


	function setConfig(element, config, block) {

		config = mergeConfig(config);
		element.fill({color: config.fill_default, opacity: .35});
		element.stroke({color: config.stroke_default, width: 2, opacity: .6});

		element.on('mouseenter', function(event) {

			element.fill({color: config.fill_hover, opacity: .35});
			element.stroke({color: config.stroke_hover, width: 2, opacity: .6});
			$(block).trigger('polyimages.mouseenter', { element: element, config: config });

		});

		element.on('mouseover', function(event) {
			(block).trigger('polyimages.mouseover', { element: element, config: config });
		})

		element.on('mouseout', function(event) {

			element.fill({color: config.fill_default, opacity: .35});
			element.stroke({color: config.stroke_default, width: 2, opacity: .6});
			$(block).trigger('polyimages.mouseout', { element: element, config: config });

		});

		element.on('click', function(event) {

			$(block).trigger('polyimages.click', { element: element, config: config });

		});
	}

	function mergeConfig(config) {
		var out = Object.assign({},defaultConfig);
		for(i in config) out[config[i].name] = config[i].value;
		return out;
	}

	$(".poy-image").each(function(index, block) {

		var objects = $(block).data("poly");
		if(objects.length && typeof(objects) != "object") objects = JSON.parse(objects);
		if (objects && typeof(objects) == "object"){

			var id = getId();
			$(block).append($("<div>").addClass('polyimage')).attr("id",id);

			var draw = SVG(id);

	        for(index in objects){
	            var item = objects[index];
	            switch(item.type){
	                case "circle": 

	                        var el = draw.circle(item.position.r*2);
	                        el.x(item.position.x);
	                        el.y(item.position.y);
	                        el.id = item.id;
	                        setConfig(el, item.config, block);

	                    break;

	                case "rect": 
	                        
	                        var el = draw.rect(item.position.width, item.position.height);
	                        el.x(item.position.x);
	                        el.y(item.position.y);
	                        el.id = item.id;
	                        setConfig(el, item.config, block);

	                    break;

	                case "polygon":
	                    
	                        var el = draw.polygon().plot(item.position.plot);
	                        el.x(item.position.x);
	                        el.y(item.position.y);
	                        el.id = item.id;
	                        setConfig(el, item.config, block);

	                    break;
	            }

	        }
	    }

	});

	$(".poy-image").on('polyimages.mouseenter', function(event, props) {
		$(".balloon").remove();
		if(!props.config.balloon_active == 1 || !props.config.balloon || !props.config.balloon_position) return;
		var balloon = $("<div>").addClass('balloon').append($(props.config.balloon));
		$("body").append(balloon);

		var positionSvg = $(props.element.node).offset();

		switch(props.config.balloon_position){
			case "t":
				balloon.css({
					position:"absolute",
					left: positionSvg.left - balloon.width()/2,
					top: positionSvg.top
				})
			break;
			case "r":
				balloon.css({
					position:"absolute",
					left: positionSvg.left+props.element.width(),
					top: positionSvg.top
				})
			break;
			case "l":
				balloon.css({
					position:"absolute",
					left: positionSvg.left - balloon.width(),
					top: positionSvg.top
				})
			break;
			case "b":
				balloon.css({
					position:"absolute",
					left: positionSvg.left - balloon.width(),
					top: positionSvg.top+$(props.element.node).height()
				})
			break;

			default: 
				balloon.hide();
			break;
		}


	});

	$(".poy-image").on('polyimages.mouseout', function(event, props) {
		$(".balloon").remove();
	});

});