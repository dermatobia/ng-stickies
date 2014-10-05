'use strict';

app.directive('myContent', function(){
  return {
    restrict: 'A',
    scope: { note: '=myContent' },
    link: function(scope, elem) {
      elem.on('dblclick', function(){
        elem[0].setAttribute('contenteditable', 'true');
        elem[0].focus();
      });

      elem.bind('blur change', function(){
        scope.$apply(function(){
          scope.note.content = elem.html();
        });
        elem[0].removeAttribute('contenteditable');
      });
    }
  };
});