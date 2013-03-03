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
            , Router   = require('lib/router')
          
          this.homeView = new HomeView()
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
      $(function(){

        var COLORS = [ '#E3EB64', '#A7EBCA', '#FFFFFF', '#D8EBA7', '#868E80' ];
        var radius = 0;

        sketch = Sketch.create({
          container: document.getElementById( 'canvas-container' ),
          exporter: document.getElementById('export-sketch').getContext('2d'),
          background: (new Image()),
          autoclear: false,
          retina: true
        });

        sketch.setup = function(){
          sketch.$container = $(sketch.container);
          console.log( 'setup' );
          sketch.background.src = "images/cloud_1.jpg";
          sketch.$container.backstretch(sketch.background.src);

          sketch.exporter.canvas.width = sketch.canvas.width;
          sketch.exporter.canvas.height = sketch.canvas.height;
        };

        sketch.update = function(){

          radius = 2 + Math.abs( Math.sin( sketch.millis * 0.003 ) * 4 );
          // radius = 2;
        };

          // Event handlers

        sketch.keydown = function(){
          if ( sketch.keys.C ) sketch.clear();
        };

        // Mouse & touch events are merged, so handling touch events by default
        // and powering sketches using the touches array is recommended for easy
        // scalability. If you only need to handle the mouse / desktop browsers,
        // use the 0th touch element and you get wider device support for free.
        sketch.touchmove = function( e ) {
          for ( var i = sketch.touches.length - 1, touch; i >= 0; i-- ) {
            touch = sketch.touches[i];

            sketch.lineCap = 'round';
            sketch.lineJoin = 'round';
            sketch.fillStyle = sketch.strokeStyle = COLORS[ i % COLORS.length ];
            sketch.lineWidth = radius;

            sketch.beginPath();
            sketch.moveTo( touch.ox, touch.oy );
            sketch.lineTo( touch.x, touch.y );
            sketch.stroke();
          }
        };

        sketch.export = function() {
          var w = sketch.canvas.width,
              h = sketch.canvas.height,
              offsetX = 0,
              offsetY = 0;

          sketch.exporter.drawImage(
            sketch.background,
            offsetX,
            offsetY
          );
        };

        sketch.start();
      });
    }
  };

  module.exports = cloudspotting;
  
});
window.require.register("initialize", function(exports, require, module) {
  var application = require('application')
  var cloudspotting = require('cloudspotting')

  $(function() {
      application.initialize()
      Backbone.history.start()
      cloudspotting.initialize()
  })
  
});
window.require.register("lib/router", function(exports, require, module) {
  var application = require('application')

  module.exports = Backbone.Router.extend({
      routes: {
          '': 'home'
      },
      
      home: function() {
          $('body').html(application.homeView.render().el)
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
window.require.register("views/home_view", function(exports, require, module) {
  var View     = require('./view')
    , template = require('./templates/home')

  module.exports = View.extend({
      id: 'home-view',
      template: template
  })
  
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    


    return "<header>\n  <div class=\"container\">\n    <h1>Cloudspotting</h1>\n  </div>\n</header>\n\n\n<div id=\"sketch-container\">\n  <div id=\"canvas-container\">\n  </div>\n  <canvas id=\"export-sketch\"></canvas>\n</div>\n";});
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
