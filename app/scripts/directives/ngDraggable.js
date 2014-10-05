'use strict';


app.directive('ngDraggable', function($document) {
    return {
      restrict: 'A',
      scope: {
        dragInfo: '=ngDraggable'
      },
      link: function(scope, elem) {
        var startX, startY, 
            x, y,
            inittialOffsetX = elem[0].offsetLeft,
            initialOffsetY = elem[0].offsetTop,
            // start, stop, drag, container,
            width  = elem[0].offsetWidth,
            height = elem[0].offsetHeight,
            noteInfo, 
            container = document.getElementById('board').getBoundingClientRect();
        
        // Obtain drag options
        if (scope.dragInfo) {
          noteInfo = scope.dragInfo;
        }
        
      // Bind mousedown event
        elem.on('mousedown', function(e) {
          startX = e.clientX - elem[0].offsetLeft + inittialOffsetX - 15;
          startY = e.clientY - elem[0].offsetTop + initialOffsetY - 15;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        // Handle drag event
        function mousemove(e) {
          x = e.clientX - startX;
          y = e.clientY - startY;
          setPosition();
        }

        // Unbind drag events
        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }

        // Move element, within container if provided
        function setPosition() {
          if (container) {
            if (x < 0) {
              x = 0;
            } else if (x > container.right - width*2.9) {
              x = container.right - width*2.9;
            }
            if (y < container.top) {
              y = container.top;
            } else if (y > container.bottom - height*1.1) {
              y = container.bottom - height*1.1;
            }
          }
          elem.css({
            top: y + 'px',
            left: x + 'px'
          });
          noteInfo.x = x;
          noteInfo.y = y;
        }
      }
    };
  });