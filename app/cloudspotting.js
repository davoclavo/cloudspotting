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
