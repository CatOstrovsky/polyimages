function popupwindow(url, title, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
} 

$(window).on('load', function(event) {
	$("#mainloader").removeClass('show');
});	


webix.ready(function(){

	var lang = window.moduleConfig.lang;

	webix.protoUI({
	   name:"imageSelect",
	   $init:function(config){
	   		var el = $("<div>").addClass('imagePicker'); 
	        this.$view.append(el.get(0));
	   },
	   setImage: function(id) {
	   	  $(this.$view).find(".imagePicker").empty().append($("<iframe>").attr("src", "/assets/modules/polyimages/polyimages.editor.php?id="+id));

	   },
	   defaults:{
		  height: "500px",
		  width: "100%"
	   }
	}, webix.ui.list,
	webix.Movable);


	webix.ui({
		container: "wrapper",
		rows:[
		{
			view:"button", 
			id:"addimage", 
			type:"form", 
			inputWidth:200,
			label: lang.add_image,
			click: function() {
				$$("createImage").show();
			}
		},
		{
			view:"datatable", 
			autoheight: true,
			multiselect:true,
			pager: "pager_listing",	  	
			scroll: false,
			autoheight: true,
			select:"row",
			rowHeight:80,
			id: "listingImages",
			columns:[

				{ id:"id",    		header:lang.id,	 							fillspace:1},
				{ id:"name",    	header:lang.name,		 					fillspace:3},
				{ id:"objects",   	header:lang.objects_count, 	fillspace:3, template: function(data) {
					if(!data.objects || data.objects == 0) return 0;
					return data.objects.length;
				}},
				{ id:"image",   	header:lang.image, 						fillspace:3, template: "<img src="+moduleConfig.site_url+"#image# class=imagepreview>"},
				{ id:"active",   	header:lang.actves, 						fillspace:1, template: function(data) {
					return (data.active==1) ? lang.active : lang.not_active;
				}},
			],
			url: window.moduleConfig.moduleurl+"action=getAll"
		},
		{
			view: "pager",
			size:15,
			group:20,
			id: "pager_listing"
		}
		]		
	})


	webix.ui({
		view:"popup",
		id:"editImage",
		head:lang.edit_image,
		width: 500,
		height: 300,
		position:"center",
		body:{
			view:"form", 
			id: "formEditImage",
			elements:[
				{ view: "text", value:"" , hidden: true, name: "id"},
				{ view:"text", value:"", label: lang.name, labelPosition:"top", name: "name"},
				{
					css: "selectimage_buttons",
					cols:[
						{ view:"text", value:"", label: lang.image, labelPosition:"top", name: "image"},
						{ view:"button", value:"", label: lang.select_image,  click: function() {
							window.KCFinder = {
						     	callBack : function(url){
									var values = $$("formEditImage").getValues();
									values.image = url;
									$$("formEditImage").setValues(values);
								}
							};
					     	popupwindow("/manager/media/browser/mcpuk/browse.php?opener=KCFinder&field=mceu_65-inp&type=images", "Select File", 1000, 400);

						}},
					]
				},
				{ view:"checkbox", value:"Login",  label: lang.actves,labelWidth:80 , name: "active" },
				{
				css:"btns_full",
				cols: [
					{
						view: "button",
						css: "close_btn",
						value:lang.cancel,
						click: function() {
							$$("formEditImage").clear();
							$$("editImage").hide();
						}
					},
					{
						view:"button", 
						css:"delete_btn",
						value:lang.delete,
						click: function() {
							deleteAlias(selectedItem);
							$$("formEditImage").clear();
							$$("editImage").hide();
						}
					},
					{
						view:"button",
						css:"select_dots_btn",
						value:lang.select_dots,
						click: function() {
							$$("imageSelectDots").setImage(selectedItem.id);
							$$("editDots").show();
						}
					},
					{
						view:"button",
						css:"save_btn",
						value:lang.save,
						click: function() {

							var fields = $$("formEditImage").getValues();
							fields['action'] = 'update';
							
							$$("formEditImage").clear();
							$$("editImage").hide();

							$.post(window.moduleConfig.moduleurl, fields).then(function(resp) {
								$$('listingImages').updateItem(resp.id,resp);
							})

						}
					}					
				]
			}]
		}
	});

	webix.ui({
		view:"popup",
		id:"editDots",
		head:lang.select_dots,
		width: 1000,
		height: 1000,
		position:"center",
		body:{
			view:"form", 
			id: "formEditDots",
			elements:[
				{
					view:"imageSelect",
					height:500,
					width: "auto",
					css: "wrapperImageSelect",
					id: "imageSelectDots"
				},
				{
				css:"btns_full flex",
				cols: [
					{
						view: "button",
						css: "close_btn",
						value:lang.cancel,
						click: function() {
							$$("editDots").hide();
							$$("formEditDots").clear();
						}
					},
					{
						view:"button",
						css:"save_btn",
						value:lang.save,
						click: function() {

							var objects = $(".imagePicker iframe").get(0).contentWindow.cordinator.getData();
							objects = JSON.stringify(objects);
							$.post(window.moduleConfig.moduleurl, {action: 'update', id: selectedItem.id, objects: objects}).then(function(resp) {
								$$('listingImages').updateItem(resp.id,resp);
								$$("editDots").hide();
								$$("formEditDots").clear();

								var fields = $$("formEditImage").getValues();
								fields['objects'] = objects;
								$$("formEditImage").setValues(fields);

							})

						}
					}					
				]
			}]
		}
	});


	webix.ui({
		view:"popup",
		id:"createImage",
		head:lang.add_image,
		width: 500,
		height: 300,
		position:"center",
		body:{
			view:"form", 
			id: "formCreateImage",
			elements:[
				{ view:"text", value:"", label: "Название", labelPosition:"top", name: "name"},
				{
					css: "selectimage_buttons",
					cols:[
						{ view:"text", value:"", label: lang.image, labelPosition:"top", name: "image"},
						{ view:"button", value:"", label: lang.select_image,  click: function() {
							window.KCFinder = {
						     	callBack : function(url){
									var values = $$("formCreateImage").getValues();
									values.image = url;
									$$("formCreateImage").setValues(values);
								}
							};
					     	popupwindow("/manager/media/browser/mcpuk/browse.php?opener=KCFinder&field=mceu_65-inp&type=images", "Select File", 1000, 400);

						}},
					]
				},
				{ view:"checkbox", value:"Login",  label: lang.actves,labelWidth:80 , name: "active" },
				{
				css:"btns_full flex",
				cols: [
					{
						view: "button",
						css: "close_btn",
						value:lang.cancel,
						click: function() {
							$$("formCreateImage").clear();
							$$("createImage").hide();
						}
					},
					{
						view:"button",
						css:"save_btn",
						value:lang.add,
						click: function() {
							var fields = $$("formCreateImage").getValues();
							fields['action'] = "create";

							$.post(window.moduleConfig.moduleurl,  fields).then(function(resp) {
								$$("createImage").hide();
								$$("formCreateImage").clear();
								$$('listingImages').add(resp);
							})
							
						}
					}					
				]
			}]
		}
	});
	
	var selectedItem = {id:0,active:0};

	webix.ui({
		view: "contextmenu",
		css:"contextmenu_style",
		id: "contextmenuEditImage",
		data: [
		{ value: lang.edit, id: 1 },
		{ value: lang.on_off, id: 2},
		{ value: lang.delete, id: 3 }
		],
		on:{
			onItemClick:function(id){
				if(id == 1){
					$.post(window.moduleConfig.moduleurl, {action: 'get', id: selectedItem.id}).then(function(resp) {
						$$('formEditImage').setValues(resp);
						$$("editImage").show();
					})
				}else if(id == 2){
					$.post(window.moduleConfig.moduleurl, {action: 'update', id: selectedItem.id, active: (selectedItem.active==1)?0:1}).then(function(resp) {
						$$('listingImages').updateItem(resp.id,resp);
					})					
				}else if(id == 3){
					deleteAlias(selectedItem);
				}
				
			}
		}
	});

	function deleteAlias(item) {
		webix.confirm({
		    text:lang.delete+" "+" №"+item.id+"?", 
		    callback: function(result){
		    	if(result){
			       $.post(window.moduleConfig.moduleurl, {action: 'delete', id: item.id}).then(function(resp) {
						$$('listingImages').remove(item.id);
					})
			   }
		    }
		});
	}

	$$('listingImages').attachEvent('onBeforeContextMenu', function(id, e, node){
		this.select(id);
		var selectedId = this.getSelectedId(true, true)[0];
		selectedItem = $$('listingImages').getItem(selectedId);
	});

	$$('contextmenuEditImage').attachTo($$('listingImages'));
})