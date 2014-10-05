'use strict';

app.controller('BoardsCtrl', function ($scope, FIREBASE_URL, $firebase) {
  
  // ---------- FIREBASE SET UP ---------------

  var ref = new Firebase(FIREBASE_URL);

  // $scope.data (3-way binding)
  $firebase(ref)
    .$asObject()
    .$bindTo($scope, 'data')
    .then(function(){

      // $scope.boards (3-way binding)
      $firebase(ref.child('boards'))
        .$asObject()
        .$bindTo($scope, 'boards');

      // boards collection 
      $scope.boardsArr = $firebase(ref.child('boards'))
                          .$asArray();

      createFirebaseNotesObjAndArr();
    });


  // helper method to create $scope.notes and $scope.notesArr
  // based on whichever board that is currently active
  function createFirebaseNotesObjAndArr(){
    
    // $scope.notes:
    //  - 3-way binding of notes-object on active board
    //  - has unbind function for later use when board no longer active
    $firebase(ref.child('boards/' + $scope.data.selectedBoard + '/notes'))
      .$asObject()
      .$bindTo($scope, 'notes')
      .then(function(unbind){
        $scope.unbindLater = function(){
          unbind();
        };
      });

    // notes collection on active board
    $scope.notesArr = $firebase(ref.child('boards/' + $scope.data.selectedBoard + '/notes'))
                        .$asArray();
  }


  // ---------- BOARD ---------------

  $scope.createBoard = function(){
    var boardTemplate = { name: 'new board', editing: false};
    var noteTemplate = { x: 0, y: 0, content: 'new note'};

    $scope.boardsArr.$add(boardTemplate).then(function(ref){
      var notes = $firebase(ref.child('notes')).$asArray();
      notes.$add(noteTemplate);
    
      // --- Improvement Idea: auto-select newly created board
      // $scope.data.selectedBoard = $firebase(ref).$asObject().$id
    });
  };

  $scope.editBoard = function(board){
    $scope.boards[board.$id].editing = true;
  };

  $scope.doneEdit = function(board){
    $scope.boards[board.$id].editing = false;
  };

  $scope.deleteBoard = function(){
    // after board deletion is completed, first board
    // on the list will be selected by default
    var onComplete = function(){
      $scope.selectBoard($scope.boardsArr[0]);
    };

    ref.child('boards/' + $scope.data.selectedBoard).remove(onComplete);
    $scope.deleteModalShown = false;

    // --- Improvement Idea:
    //  auto-select board above deleted board? 
  };

  $scope.selectBoard = function(board){
    $scope.data.selectedBoard = board.$id;
    $scope.unbindLater(); // unbind $scope.notes 3-way binding of old board
    
    // create and bind new notes of new active board
    createFirebaseNotesObjAndArr();
  };

  $scope.isSelected = function(board){
    return $scope.data.selectedBoard === board.$id;
  };

  // ---------- NOTE ---------------

  $scope.addNote = function(e){
    if (e.target === e.currentTarget){  
      var newNoteTemplate = { content: 'new note!',
                              x: e.offsetX,
                              y: e.offsetY };
      $scope.notesArr.$add(newNoteTemplate);
    }
  };

  $scope.removeNote = function(note){
    ref.child('boards/' + $scope.data.selectedBoard + '/notes/' + note.$id ).remove();
  };

  // ---------- MODAL ---------------

  $scope.modalInfoShown = false;

  $scope.toggleInfoModal = function() {
    $scope.modalInfoShown = !$scope.modalInfoShown;
  };

  $scope.deleteModalShown = false;
  $scope.toggleDeleteModal = function(){
    $scope.deleteModalShown = !$scope.deleteModalShown;
  };

});

