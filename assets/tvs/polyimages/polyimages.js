if(typeof(makePoly != "function")){
	function makePoly(id, value) {
		if(value && value.length){
			try{value = jQuery.parseJSON(value);}catch(e){}
		}
		if(typeof(value) != 'object') value = "";

		var $ = jQuery;
		var el = jQuery("#poly_select_"+id);
		var values = [];

		el.on('change', function(event) {
			setActive(jQuery(this).find('option:checked'))
		});

		function setActive(selected) {

			if(!$("#polyimage-preview_"+id).length)
				$(el).after($("<div>").addClass('polyimage-preview').attr("id","polyimage-preview_"+id));

			$("#polyimage-preview_"+id).empty().append($("<img>").attr("src", selected.data("image")));

			if(!$("#polyimage-select_"+id).length)
				$("#polyimage-preview_"+id).after($("<form>").addClass('polyimage-select').attr("id","polyimage-select_"+id));

			try{
				var objects = selected.data("objects");
			}catch(e){}
			
			$("#polyimage-select_"+id).empty();
			if(typeof(objects) == "object"){
				for(i in objects){
					
					var object = objects[i];
					if(!object.id) continue;
					
					var val = "";
					if(typeof(value) == "object" && typeof(value.selected) == "object") if(typeof(value.selected.hasOwnProperty(object.id))) val = value.selected[object.id];

					$("#polyimage-select_"+id).append(
						$("<div>").addClass('row_select').append(
								$("<p>").text("#"+object.id+" ("+object.type+")")
							).append(
								$("<textarea>").attr({name:object.id}).bind('input', function(event) {
									updateValue();
								}).val(val)
							)
						)
				}
			}

			updateValue();
		}

		function updateValue() {

			var json = {},
			fields = jQuery("#polyimage-select_"+id).serializeArray();
			for(i in fields){
				var field = fields[i];
				if(!field.value) continue;
				json[field.name] = field.value;
			}

			var out = {
				value:jQuery(el).find('option:checked').val(),
				selected: json
			};
			$("#tv"+id).text(JSON.stringify(out)).val(JSON.stringify(out));
		}
		

		if(typeof(value) == "object"){
			if(typeof(value.value)) el.find("option[data-id="+value.value+"]").prop("selected", true);
		}

		el.trigger('change');

	}
}