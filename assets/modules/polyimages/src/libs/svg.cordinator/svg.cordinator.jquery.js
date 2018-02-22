(function( $ ) {
    
    var svgCordinator = function svgCordinator(el, options) {
        
        this.el = $(el);
        this.params = {
            responsive : (options.responsive ? true : false),
            controls : (options.controls ? options.controls : false),
            watcher : (options.watcher ? options.watcher : false),
            nav : (options.nav ? options.nav : false),
        };
        this.position = {
            x:0,
            y:0
        };
        this.nav = {};
        this.state = "init";
        this.elements = [];
        this.activeElement = {};
        this.canvas = {};

        var _this = this;

        this.init = function() {
            this.bind();
            this.watcher();
            this.addCanvas();
            this.renderNav();
            return this;
        }

        this.addCanvas = function() {
            var el = $("<div>").addClass('svg').attr('id', "svg");
            $(this.el).append(el);
            this.canvas = SVG('svg').size($(this.el).width(),$(this.el).height()).panZoom();
        }

        this.bind = function() {
            
            if(typeof(this.params.controls) == 'object'){
                if(this.params.controls.circle)  this.bindClick(this.params.controls.circle, 'make.circle');
                if(this.params.controls.rect)  this.bindClick(this.params.controls.rect, 'make.rect');
                if(this.params.controls.polygon)  this.bindClick(this.params.controls.polygon, 'make.polygon');
            }

        }

        this.bindClick = function(el, state) {
            var _this = this;
            $(el).bind('click',function(event) {
                event.preventDefault();
                _this.state = state;
                _this.deactiveBtns();
                $(this).addClass('active');
            });
        }

        this.deactiveBtns = function() {
            if(typeof(_this.params.controls) == 'object'){
                for(index in _this.params.controls){
                    var el = _this.params.controls[index];
                    $(el).removeClass('active');
                }
            }
        }


        this.setActive = function(el) {

            for(index in this.elements)  this.elements[index].selectize(false, {deepSelect:true}).resize(false);
            this.activeElement = el;
            el.selectize({deepSelect:true}).resize().draggable(true);
        }

        this.mousemove = function(event) {
            var offset = $(_this.el).offset();
            _this.position = {
                x: event.clientX-offset.left,
                y: event.clientY-offset.top
            };

            if(typeof(_this.params.watcher) == "object")
                $(_this.params.watcher.el).text(_this.params.watcher.template.replace("#x#",_this.position.x).replace("#y#",_this.position.y));
            
        }

        this.mousedown = function(event) {

            if($(event.target).is("svg") || $(event.target).closest(".svg").length){

                var offset = $(_this.el).offset();
                _this.position = {
                    x: event.clientX-offset.left,
                    y: event.clientY-offset.top
                };

                if(_this.state == "make.circle"){

                    _this.state = "start";

                    var circle = _this.canvas.circle().draw(event);

                    circle.on('drawstop', function(event) {
                        _this.elements.push(circle);
                        _this.setActive(circle);

                        _this.updateNav();
                        _this.deactiveBtns();
                    });

                }else if(_this.state == "make.rect"){

                    _this.state = "start";

                    var rect = _this.canvas.rect().draw(event);

                    rect.on('drawstop', function(event) {
                        _this.elements.push(rect);
                        _this.setActive(rect);

                        _this.updateNav();
                        _this.deactiveBtns();                       
                    });


                    

                }else if(_this.state == "make.polygon"){

                    _this.state = "start";

                    var polygon = _this.canvas.polygon().draw(event);

                    polygon.on('drawstop', function(event) {
                        _this.elements.push(polygon);
                        _this.setActive(polygon);

                        _this.updateNav();
                        _this.deactiveBtns(); 
                    });

                    polygon.on('drawstart', function(e){
                        document.addEventListener('keydown', function(e){
                            if(e.keyCode == 13 || e.keyCode == 27 || e.key == "Escape"){
                                polygon.draw('done');
                                polygon.off('drawstart');
                            }
                        });
                    });

                }

            }
        }

        this.watcher = function() {
            
            $(this.el).on('mousemove', this.mousemove);
            $(this.el).on('mousedown', this.mousedown)

        }

        this.getData = function() {
            var out = [];

            for(index in cordinator.elements){
                var element = cordinator.elements[index];
                switch(element.type){
                    case "circle": 
                    var outElement = {
                        type: element.type,
                        id: (element.id) ? element.id : 0,
                        position: {
                            cx: parseInt(element.cx()),
                            cy: parseInt(element.cx()),
                            r: parseInt(element.ry()),
                            x: parseInt(element.x()),
                            y: parseInt(element.y()),
                        },
                        config: (typeof(element.config)) ? element.config : {},
                        removed: (element.removed) ? 1 : 0
                    };
                    out.push(outElement);

                        break;

                    case "rect": 
                    var outElement = {
                        type: element.type,
                        id: (element.id) ? element.id : 0,
                        position: {
                            x: parseInt(element.attr("x")),
                            y: parseInt(element.attr("y")),
                            width: parseInt(element.attr("width")),
                            height: parseInt(element.attr("height")),
                        },
                        config: (typeof(element.config)) ? element.config : {},
                        removed: (element.removed) ? 1 : 0
                    };
                    out.push(outElement);

                        break;

                    case "polygon": 
                    var outElement = {
                        type: element.type,
                        id: (element.id) ? element.id : 0,
                        position: {
                            plot: element.plot().value,
                            x: parseInt(element.x()),
                            y: parseInt(element.y()),
                        },
                        config: (typeof(element.config)) ? element.config : {},
                        removed: (element.removed) ? 1 : 0
                    };
                    out.push(outElement);

                        break;
                }

            }

            return out;

        }

        this.setData = function(items) {

            var draw = _this.canvas;

            for(index in items){
                var item = items[index];
                switch(item.type){
                    case "circle": 

                            var el = draw.circle(item.position.r*2);
                            el.x(item.position.x);
                            el.y(item.position.y);
                            if(typeof(item.config)) el.id = item.id;
                            if(typeof(item.config)) el.config = item.config;
                            this.elements.push(el);

                        break;

                    case "rect": 
                            
                            var el = draw.rect(item.position.width, item.position.height);
                            el.x(item.position.x);
                            el.y(item.position.y);
                            if(typeof(item.config)) el.id = item.id;
                            if(typeof(item.config)) el.config = item.config;
                            this.elements.push(el);

                        break;

                    case "polygon":
                        
                            var el = draw.polygon().plot(item.position.plot);
                            el.x(item.position.x);
                            el.y(item.position.y);
                            if(typeof(item.config)) el.id = item.id;
                            if(typeof(item.config)) el.config = item.config;
                            this.elements.push(el);

                        break;
                }

            }

            this.updateNav();
        }


        this.renderNav = function() {
            if(!this.params.nav) return false;
            this.nav = $("<div>").addClass('navigations');
            $(this.el).append(this.nav);
        }

        this.updateNav = function() {

            this.nav.empty();

            for( index in this.elements ){

                var element = this.elements[index];
                if(element.removed) continue;

                var el = $("<a>").text(`${element.type} - (${parseInt(element.x())}:${parseInt(element.y())})`);

                (function(el, element){
                    el.on("click", function(e) {
                        e.preventDefault();
                        _this.setActive(element);
                    })    
                }(el, element))
                
                var remove = $("<span>").addClass('remove-el');
                el.append(remove);

                (function(el, element, index){
                    remove.on("click", function(e) {
                        e.preventDefault();
                        element.selectize(false, {deepSelect:true});
                        element.remove();
                        if(element.id){
                            element.removed = true;
                        }else{
                            delete _this.elements[index];
                        }
                        _this.updateNav();
                    })    
                }(el, element, index))

                var edit = $("<span>").addClass('edit-el');
                el.append(edit);

                (function(el, element, index){
                    edit.on("click", function(e) {
                        e.preventDefault();

                        $(".edit-modal form").get(0).reset();

                        if(element.config && typeof(element.config)){
                            for(i in element.config){
                                var conf = element.config[i];
                                if($("[name="+conf.name+"]").length){
                                    if($("[name="+conf.name+"]").is("[type=checkbox]")){

                                        if(conf.value==1){
                                            $("[name="+conf.name+"]").prop("checked",true);
                                        }
                                    }else{
                                         $("[name="+conf.name+"]").val(conf.value);
                                    }
                                   
                                }
                            }
                        }
                        $(".edit-modal").fadeIn(300);

                        $(".save-edit").unbind('click').bind('click', function(event) {
                            event.preventDefault();
                            element.config = $("#settings_form").serializeArray();
                            $(".edit-modal").fadeOut(300);
                            $(".edit-modal form").get(0).reset();
                        });

                    })    
                }(el, element, index))

                this.nav.append(el);

            }
        }

    }

    $.fn.svgCordinator = function(options) {
        return new svgCordinator(this , options);
    }
 
}( jQuery ));

