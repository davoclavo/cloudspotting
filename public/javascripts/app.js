(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  // Application bootstrapper.
  Application = {
      initialize: function() {
          
          var HomeView = require('views/home_view')
            , FeedView = require('views/feed_view')
            , Router   = require('lib/router')
          
          this.homeView = new HomeView()
          this.feedView = new FeedView()
          this.router   = new Router()
          
          if (typeof Object.freeze === 'function') Object.freeze(this)
          
      }
  }

  module.exports = Application
  
});
window.require.register("cloudspotting", function(exports, require, module) {
  // Cargar imagen
  // Poder dibujar en una layer encima de la imagen
  // Juntar las imagenes
  // Subirla

  // Cloud: Imagen, GEO, Comment, User, Votes,


  cloudspotting = {


    initialize: function(){
      var IMGUR = {
        clientID: '78efd24716370d8',
        key: '8c78586d699eb1ee78db85b146053996eccf1eff'
      };
      var FILETYPE = 'jpg';
      var firebase = new Firebase('https://cloudspotting.firebaseio.com/');


      $(function(){
        var COLORS = ['#000', '#EA1F8D', '#F5E535', '#74C6A3', '#4994D0', '#75CDDC', '#9F8CC2', '#D66BA9', '#ED2248'];
        var IMAGESPATH = 'images/';
        var CLOUDS = _.range(1,18).map(function(num){return ('cloud-'+num+'.jpg'); });
        var DEMOIMG = 'cloud-howto.jpg';
        var radius = 0;
        var container = document.getElementById( 'canvas-container' );
        var width = $(container).width();

        sketch = Sketch.create({
          container: container,
          exporter: document.getElementById('export-canvas').getContext('2d'),
          background: {
            ctx: document.getElementById('background-canvas').getContext('2d'),
            image: (new Image())
          },
          autoclear: false,
          retina: false,
          fullscreen: false,
          width: width,
          height: width
        });

        sketch.setup = function(){
          sketch.$container = $(sketch.container);
          sketch.setBackground(IMAGESPATH+DEMOIMG);

          sketch.background.ctx.canvas.width = sketch.canvas.width;
          sketch.background.ctx.canvas.height = sketch.canvas.height;
          sketch.background.ctx.canvas.style.width = sketch.canvas.width;
          sketch.background.ctx.canvas.style.height = sketch.canvas.height;
          // console.log(sketch.background.ctx.canvas.width,sketch.background.ctx.canvas.height);
          sketch.exporter.canvas.width = sketch.canvas.width;
          sketch.exporter.canvas.height = sketch.canvas.height;
          sketch.thickness = 2;
          sketch.snapshots = [];

          sketch.loadPalette();

          // Just draw when the mouse is pressed
          sketch.drawing = false;
          // Avoid cursor changing
          $(sketch.canvas).mousedown(function(event){
              event.preventDefault();
          });
        };

        sketch.update = function(){

          radius = sketch.thickness + Math.abs( Math.sin( sketch.millis * 0.002 ) * 2 );
          // radius = 2;
        };

        sketch.loadPalette = function(){
          // sketch.fillStyle = sketch.strokeStyle = COLORS[Math.floor(Math.random()*COLORS.length)];
          sketch.fillStyle = sketch.strokeStyle = COLORS[0];

          $('#palette .color').each(function(index, element){
            $(element).find('a').css('color', COLORS[index]);
            // element.style.color = COLORS[index];
            $(element).data('color', COLORS[index]);
          });

          $('.color').click(function(event){
            // $('#status').text('Color changed to: ' + $(this).data('color'));
            // $('.color').attr('class', 'color');
            var $this = $(this);
            $this.addClass('active').siblings().removeClass('active');
            sketch.fillStyle = sketch.strokeStyle = $this.data('color');
            event.preventDefault();
          });
        };
          // Event handlers


        sketch.touchmove = function( e ) {
          if(sketch.drawing){
            touch = sketch.touches[0]; // for... i to use multitouch

            sketch.lineCap = 'round';
            sketch.lineJoin = 'round';
            sketch.lineWidth = radius;

            sketch.beginPath();
            sketch.moveTo( touch.ox, touch.oy );
            sketch.lineTo( touch.x, touch.y );
            sketch.stroke();
          }
        };

        sketch.share = function() {
          var w = sketch.canvas.width,
              h = sketch.canvas.height;


          sketch.exporter.drawImage(sketch.background.ctx.canvas, 0, 0);
          sketch.exporter.drawImage(sketch.canvas, 0, 0);

          imgur(sketch.exporter.canvas, $('name').val());


          // var datauri = sketch.exporter.canvas.toDataURL();
          // var link = document.createElement('a');
          // link.target = '_blank';
          // link.click();
          // link.href = datauri;
          // link.click();
        };

        sketch.mousedown = function(){
          sketch.drawing = true;
          // $('#status').text('mousedown');
        };

        sketch.mouseup = function(){
          sketch.drawing = false;
          // Push snapshot
          sketch.snapshots.push(sketch.canvas.toDataURL());
          if(sketch.snapshots.length > 10) {
            // Remove the oldest snapshot
            sketch.snapshots.splice(0,1);
          }
          // Set maximum snapshots, or skip several, to save memory
          // $('#status').text('mouseup');
        };

        sketch.undo = function(){
          // Get the last snapshot
          var snapshot = sketch.snapshots.pop();

          // Replace current canvas
          sketch.canvas.drawImage(snapshot, 0, 0);
        };

        sketch.setBackground = function(src){
          sketch.background.image.src = src;
          // sketch.$container.backstretch(src);
          console.log('Setting background: '+src);
          // sketch.$container.backstretch(sketch.background.image.src);
        };

        $(sketch.background.image).load(function(){
          var bg = sketch.background.image;

          console.log(['IMAGE LOADED',bg.width, bg.height].join(', '));

          var aspectRatio, side;

          var offsetX, offsetY;

          var width = bg.width, height = bg.height;

          // var autorotate = false;
          // if((session.browser.os === 'iPad' && Math.abs(window.orientation) === 90) || session.browser.os === 'iPhone') {
          //   autorotate = true;
          //   width = bg.height;
          //   height = bg.width;
          // }

          if(width > 0 && height > 0) {
            if (width >= height) {
              // Horizontal
              aspectRatio = height/sketch.canvas.height;
              offsetX = (width - sketch.canvas.width*aspectRatio) / 2;
              offsetY = 0;
              side = height;
              // console.log("Horizontal!");
            } else {
              // Vertical
              aspectRatio = width/sketch.canvas.width;
              offsetX = 0;
              offsetY = (height - sketch.canvas.height*aspectRatio) / 2;
              size = width;
              // console.log("Vertical!");
            }

            // $('#status').text([width,height, aspectRatio].join(','));

            sketch.background.ctx.drawImage(bg, offsetX, offsetY, side, side, 0, 0, sketch.canvas.width, sketch.canvas.height);

            // if(autorotate){
            //   sketch.background.ctx.rotate(Math.PI / 2);
            // }
          }
        });

  // Events
        sketch.mouseover = function(){
          // $('#status').text('mouseover');
        };

        sketch.mousemove = function(){
          // $('#status').text('mousemove');
        };

        sketch.mouseout = function(){
          // $('#status').text('mouseout');
        };

        sketch.draw = function(){
        };

        // sketch.click = function(){
        //   $('#status').text('click');
        // };
        //

        sketch.start();

        var showSpinner = function() {
          // $('#share').spin({length: 5, radius: 2, width: 5});
          $('#sketch-container').spin({length: 40, radius: 30, width: 20});
        };

        var hideSpinner = function() {
          // $('#share').spin();
          $('#sketch-container').spin();
        };

        var upload = document.getElementById('cloud-input');
        if(typeof window.FileReader === 'undefined') {
          console.error('fail - cant preview your image. Use a decent browser plz');
        } else {
          // console.log('houston: file API works');
        }
         
        upload.onchange = function (e) {
          e.preventDefault();

          var file = upload.files[0],
              reader = new FileReader();
          reader.onload = function (event) {
            // event.target.result = src
            sketch.setBackground(event.target.result);
          };
          reader.readAsDataURL(file);
          return false;
        };

        sketch.canvas.ondragover = function () { this.className = 'hover'; return false; };
        sketch.canvas.ondragend = function () { this.className = ''; return false; };
        sketch.canvas.ondrop = function (e) {
          e.preventDefault();

          var file = e.dataTransfer.files[0],
              reader = new FileReader();
          reader.onload = function (event) {
            console.log('Drag n drop-')
            sketch.setBackground(event.target.result);
          };
          reader.readAsDataURL(file);

          return false;
        };

        $('#camera').click(function(event){
          $('#cloud-input').click();
        });

        $('#share').click(function(event){
          sketch.share();
        });

        $('#shuffle').click(function(event){
          var cloud;
          do{
            var rand = Math.floor(Math.random()*CLOUDS.length);
            cloud = IMAGESPATH+CLOUDS[rand];
          } while(sketch.background.src === cloud);
          sketch.background.src = cloud;
          console.log(cloud);
          sketch.setBackground(sketch.background.src);
          // sketch.clear();
        });

        imgur = function(canvas, name, caption) {
          var base64img = canvas.toDataURL('image/' + FILETYPE).split(',')[1];
          var $name = $('#name');
          var cloudname = $name.val();
          if(cloudname){
            $name.removeClass('error');
            showSpinner();
            $.ajax({
                url: 'https://api.imgur.com/3/upload.json',
                type: 'POST',
                headers: {
                  Authorization: 'Client-ID '+ IMGUR.clientID
                },
                data: {
                    type: 'base64',
                    key: IMGUR.key,
                    name:  (name || 'cloudspotting') + '.' + FILETYPE,
                    title: (name || 'cloudspotting') + '.' + FILETYPE,
                    caption: caption || 'Created with Cloudspotting - @Cloudspotting_',
                    image: base64img
                },
                dataType: 'json'
            }).success(function(response) {
              var id = response.data.id;
              firebase.child('clouds').child((new Date()).toString('dd-MM-yy-hh:mm')).set({
                  image: response.data.link,
                  background: sketch.background.ctx.canvas.toDataURL(),
                  name: cloudname || 'cloud'
              });
              hideSpinner();
              // redirect.
              // alert('Image uploaded successfully!\n' + response.data.link);
              var link = document.createElement('a');
              link.target = '_blank';
              link.href = 'http://twitter.com/share?&via=Cloudspotting_&text=I just found something on a cloud :) ' + encodeURIComponent(response.data.link) + ' - evaporating at @StartupBusMX';
              link.click();
              sketch.clear();
              $('#name').val('');
              console.log(response);
            }).error(function() {
                alert('Could not reach api.imgur.com. Sorry :(');
            });
          } else {
            $name.addClass('error');
          }
        };

        $('#zap').submit(function(event){
          sketch.share();
          event.preventDefault();
        });
      });

      // clouds.on('child_added', drawPixel);
      // clouds.on('child_changed', drawPixel);
      // clouds.on('child_removed', clearPixel);
    
    }
  };
  module.exports = cloudspotting;
  
});
window.require.register("initialize", function(exports, require, module) {
  var application = require('application')
  var cloudspotting = require('cloudspotting')

  $(function() {
      application.initialize()
      // Backbone.history.start({pushState: true})
      Backbone.history.start()
      cloudspotting.initialize()
  })
  
});
window.require.register("lib/router", function(exports, require, module) {
  var application = require('application')

  module.exports = Backbone.Router.extend({
      routes: {
          '': 'home',
          'feed': 'feed'
      },
      
      home: function() {
          $('body').html(application.homeView.render().el)
      },

      feed: function() {
          $('body').html(application.feedView.render().el)
      }
  })
  
});
window.require.register("lib/view_helper", function(exports, require, module) {
  // Put handlebars.js helpers here
  
});
window.require.register("models/collection", function(exports, require, module) {
  // Base class for all collections
  module.exports = Backbone.Collection.extend({
      
  })
  
});
window.require.register("models/model", function(exports, require, module) {
  // Base class for all models
  module.exports = Backbone.Model.extend({
      
  })
  
});
window.require.register("views/feed_view", function(exports, require, module) {
  var View     = require('./view')
    , template = require('./templates/feed')

  module.exports = View.extend({
      id: 'feed-view',
      template: template
  })
  
});
window.require.register("views/home_view", function(exports, require, module) {
  var View     = require('./view')
    , template = require('./templates/home')

  module.exports = View.extend({
      id: 'home-view',
      template: template
  })
  
});
window.require.register("views/templates/feed", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    


    return "<header>\n  <div class=\"container\">\n    <h1>Cloudspotting Feed</h1>\n  </div>\n</header>\n";});
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "";


    buffer += "<header class=\"bar-title\">\n  ";
    buffer += "\n  <a class=\"button\" href=\"#\" id=\"shuffle\"><i class=\"icon-cloud\"></i></a>\n  <h1 class=\"title\">Cloudspotting</h1>\n  <a class=\"button\" href=\"#\" id=\"camera\">\n    <i class=\"icon-camera\"></i>\n  </a>\n  <a class=\"button disabled\" href=\"#\" id=\"share\">\n    <i class=\"icon-twitter\"></i>\n  </a>\n</header>\n\n<div class=\"content\">\n  <form id=\"zap\">\n    <input type=\"text\" placeholder=\"What do you see?\" id=\"name\">\n    <input type=\"file\" id=\"cloud-input\" accept=\"image/gif, image/jpeg, image/png\">\n  </form>\n\n  <div id=\"sketch-container\">\n    <div id=\"canvas-container\">\n      <canvas id=\"background-canvas\"></canvas>\n    </div>\n    <canvas id=\"export-canvas\"></canvas>\n  </div>\n\n  <div class=\"content-padded\">\n      ";
    buffer += "\n\n      <ul class=\"segmented-controller\" id=\"palette\">\n        <li class=\"active color\"><a href=\"#\"><i class=\"icon-tint\"></i></a></li>\n        <li class=\"color\"><a href=\"#\"><i class=\"icon-tint\"></i></a></li>\n        <li class=\"color\"><a href=\"#\"><i class=\"icon-tint\"></i></a></li>\n        <li class=\"color\"><a href=\"#\"><i class=\"icon-tint\"></i></a></li>\n        <li class=\"color\"><a href=\"#\"><i class=\"icon-tint\"></i></a></li>\n        <li class=\"color\"><a href=\"#\"><i class=\"icon-tint\"></i></a></li>\n        <li class=\"color\"><a href=\"#\"><i class=\"icon-tint\"></i></a></li>\n        <li class=\"color\"><a href=\"#\"><i class=\"icon-tint\"></i></a></li>\n        <li class=\"color\"><a href=\"#\"><i class=\"icon-tint\"></i></a></li>\n      </ul>\n  </div>\n</div>\n";
    return buffer;});
});
window.require.register("views/view", function(exports, require, module) {
  require('lib/view_helper')

  // Base class for all views
  module.exports = Backbone.View.extend({
      
      initialize: function(){
          this.render = _.bind(this.render, this)
      },
      
      template: function(){},
      getRenderData: function(){},
      
      render: function(){
          this.$el.html(this.template(this.getRenderData()))
          this.afterRender()
          return this
      },
      
      afterRender: function(){}
      
  })
  
});
