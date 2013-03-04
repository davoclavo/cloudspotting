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
        sketch.loadPalette();

        // Just draw when the mouse is pressed
        sketch.drawing = false;
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

      sketch.save = function() {
        var w = sketch.canvas.width,
            h = sketch.canvas.height;

        sketch.exporter.drawImage(sketch.background.ctx.canvas, 0, 0);
        sketch.exporter.drawImage(sketch.canvas, 0, 0);

        var datauri = sketch.exporter.canvas.toDataURL();

        var link = document.createElement('a');
        link.target = '_blank';
        link.click();
        link.href = datauri;
        link.click();
      };

      sketch.mousedown = function(){
        sketch.drawing = true;
        $('#status').text('mousedown');
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

        sketch.loadPalette = function(){
          sketch.fillStyle = sketch.strokeStyle = COLORS[0];
          $('#palette .color').each(function(index, element){
            element.style.color = COLORS[index];
            $(element).data('color', COLORS[index]);
          });

          $('.color').click(function(eve){
            console.log('Color changed to: ' + $(this).data('color'));
            sketch.fillStyle = sketch.strokeStyle = $(this).data('color');
            eve.preventDefault();
          });
        };

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

      sketch.mousemove = function(){
        $('#status').text('mousemove');
      };

      sketch.mouseout = function(){
        $('#status').text('mouseout');
      };

      sketch.draw = function(){
      };

      // sketch.click = function(){
      //   $('#status').text('click');
      // };
      //

      sketch.start();

      var upload = document.getElementById('cloud-input');

      if(typeof window.FileReader === 'undefined') {
        console.error('fail - cant preview your image. Use a decent browser plz');
      } else {
        console.log('houston: file api successful');
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
          sketch.setBackground(event.target.result);
        };
        reader.readAsDataURL(file);

        return false;
      };
    });
  
  }
};
module.exports = cloudspotting;
