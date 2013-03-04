// Cargar imagen
// Poder dibujar en una layer encima de la imagen
// Juntar las imagenes
// Subirla

// Cloud: Imagen, GEO, Comment, User, Votes,


cloudspotting = {
  initialize: function(){
    $(function(){

      var COLORS = [ '#EA1F8D', '#F5E535', '#74C6A3', '#4994D0', '#75CDDC', '#9F8CC2', '#D66BA9', '#ED2248', '#000' ];
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
        retina: true,
        fullscreen: false,
        width: width,
        height: width
      });

      sketch.setup = function(){
        sketch.$container = $(sketch.container);
        console.log( 'setup' );

        sketch.setBackground("images/cloud_1.jpg");

        sketch.background.ctx.canvas.width = sketch.canvas.width;
        sketch.background.ctx.canvas.height = sketch.canvas.height;
        console.log(sketch.background.ctx.canvas.width,sketch.background.ctx.canvas.height);
        sketch.exporter.canvas.width = sketch.canvas.width;
        sketch.exporter.canvas.height = sketch.canvas.height;
        sketch.thickness = 2;
        sketch.snapshots = [];

        // Avoid cursor changing
        $(sketch.canvas).mousedown(function(event){
            event.preventDefault();
        });
      };

      sketch.update = function(){

        radius = sketch.thickness + Math.abs( Math.sin( sketch.millis * 0.003 ) * 4 );
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

      sketch.save = function() {
        var w = sketch.canvas.width,
            h = sketch.canvas.height,
            offsetX = 0,
            offsetY = (sketch.background.image.height - sketch.canvas.height)/2;

        sketch.exporter.drawImage(
          sketch.background.ctx.canvas,
          offsetX,
          offsetY,
          sketch.background.ctx.canvas.width,
          sketch.background.ctx.canvas.height,
          offsetX,
          offsetY,
          sketch.exporter.canvas.width,
          sketch.exporter.canvas.height
        );
      };

      sketch.mouseup = function(){
        // Push snapshot
        sketch.snapshots.push(sketch.canvas.toDataURL());
        if(sketch.snapshots.length > 10) {
          // Remove the oldest snapshot
          sketch.snapshots.splice(0,1);
        }
        // Set maximum snapshots, or skip several, to save memory
        $('#status').text('mouseup');
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
        // 
        $(sketch.background.image).load(function(){
          var bg = sketch.background.image;

          console.log('IMAGE LOADED',bg.width, bg.height);

          var aspectRatio, side;

          var offsetX, offsetY;
          if(bg.width > 0 && bg.height > 0) {
            if (bg.width > bg.height) {
              // Horizontal
              aspectRatio = bg.height/sketch.canvas.height;
              offsetX = (bg.width - sketch.canvas.width*aspectRatio) / 2;
              offsetY = 0;
              side = bg.height;
            } else {
              // Vertical
              aspectRatio = bg.width/sketch.canvas.width;
              offsetX = 0;
              offsetY = (bg.height - sketch.canvas.height*aspectRatio) / 2;
              size = bg.width;
            }
            sketch.background.ctx.drawImage(bg, offsetX, offsetY, side, side, 0, 0, sketch.canvas.width, sketch.canvas.height);
          }
        });

        sketch.showSpinner = function() {
        };

        sketch.hideSpinner = function() {
        };


        // sketch.$container.backstretch(sketch.background.image.src);
      };
// Events
      sketch.mouseover = function(){
        $('#status').text('mouseover');
      };

      sketch.mousedown = function(){
        $('#status').text('mousedown');
      };

      sketch.mousemove = function(){
        $('#status').text('mousemove');
      };

      sketch.mouseout = function(){
        $('#status').text('mouseout');
      };

      sketch.draw = function(){
      }



      // sketch.click = function(){
      //   $('#status').text('click');
      // };
      // 



      sketch.start();
    });
  }
};
module.exports = cloudspotting;
