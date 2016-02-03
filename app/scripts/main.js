(function() {

  var reveal = null;
  var waypoints = null;
  var players = [];
  var index = 0;
  // var Comment = Parse.Object.extend("Comment");

  // Parse.initialize("Ie2D91Ot043GJN42UGJfQaRtRRkiFiUpdz0jEaZD", "j7Ao39hF4E08wgkskguTbRca2UZsbnyaJkaUzP7J");

  function _init() {
    // _splitPage();
    // _getContent();
    // _makeSlide();
    // _setupPlyr();
    // _initWayPoints();
    // _initilizeReveal();
    _popUp();
    // _playPause();
    // _initComments();
    // _toggleComments();

    // _getFlow();
    // _showFlowImages();
     $('[data-toggle="popover"]').popover({
      viewport: {
        selector: 'body',
        padding: 0
      }
     })
  }

  var _showFlowImages = function() {


  }

  var _getFlow = function() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "images/Flow.svg", true);
    ajax.send();
    ajax.onload = function(e) {
      $('.flow')[0].innerHTML = ajax.responseText;
    }
  }

  var _toggleComments = function(e) {
    $(document).on('click', '.show-all-comments', _displayComments)
    $(document).on('click', '.hide-all-comments', _hideComments)
  }

  var _hideComments = function(e) {
    e.preventDefault();
    $('.display-comment').remove()
  }


  var _displayComments = function(e) {
    e.preventDefault();

    var query = new Parse.Query(Comment);
    query.find({
      success: function(results) {

        for (var i = 0; i < results.length; i++) {
          var displayComments = $('#display-comment .comment').clone();
          displayComments.addClass('display-comment number-' + i);
          displayComments.attr('style', 'top: '+ results[i].get('y')  + 'px; left: '+ results[i].get('x') +'px;');
          displayComments.text(results[i].get('content'));
          $('.notes-content').append(displayComments)
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });


  }

  var _initComments = function() {
    $(document).on('click', '.notes-content', _toggleCommentBox);
    $(document).on('click', '.submit-comment', _submitComment);
    $(document).on('click', '.comment-mark', _showComment);
  }

  var _showComment = function() {

  }

  var _removeCommentBox = function() {
    $('.new-comment').remove();
  }

  var _toggleCommentBox = function(e) {


    if($(e.target).parents('.comment').length > 0 ||
      $(e.target).parents('.player').length > 0 ||
      $(e.target).parents('.video').length > 0) {
      return;
    }

    if($(e.target).parents('.notes-content').length < 0) {
      $('.new-comment').remove();
    }


    var x = e.pageX;
    var y = e.pageY - $(this).offset().top;

    $('.new-comment').remove();

    var newComment = $('#comment .comment').clone().addClass('new-comment');

    newComment.css({
      top: y,
      left: x
    })

    newComment.attr('data-x', x);
    newComment.attr('data-y', y);

    $('.notes-content').append(newComment);
  }

  var _submitComment = function() {
    var $comment = $(this).parents('.comment');

    var comment = new Comment();
    var x = $comment.attr('data-x');
    var y = $comment.attr('data-y');

    comment.set("name", "User");
    comment.set("content", $comment.find('textarea').val());
    comment.set("x", x);
    comment.set("y", y);

    comment.save(null, {
      success: function(comment) {
        index++;
        _leaveMark(comment, x, y);
      },
      error: function(comment, err){
        console.log(err)
      }
    })
  }

  var _leaveMark = function(comment, x, y) {
    var mark = $('<div style="top: '+ y +'px; left: '+ x +'px;" class="comment-mark mark-" '+ index + '>' + index + '</div>');
    $('.notes-content').append(mark);
    $('.new-comment').remove();
  }

  var _playPause = function(){
  $('.player').each(function(){
    var inview = new Waypoint.Inview({
      element: this,
      // context: $('body'),
      enter: function(direction) {
        // var videoIndex = $(this.element).attr('data-video')
        // players[videoIndex][0].play();
      },
      entered: function(direction) {
        var videoIndex = $(this.element).attr('data-video')
        players[videoIndex][0].play();
      },
      exit: function(direction) {
        var videoIndex = $(this.element).attr('data-video')
        players[videoIndex][0].pause();
      },
      exited: function(direction) {
        var videoIndex = $(this.element).attr('data-video')
        players[videoIndex][0].pause();
      }
    })

  })


  }

  var _popUp = function() {
    $(".main-cont").lightGallery({
      selector: '.img-link',
      mode: 'lg-fade',
      thumbnail: false
    });
  }

  var _initWayPoints = function() {
    waypoints = $('h2')
      .waypoint({
        handler: function(d) {
          if (d == 'up') {
            Reveal.prev();
          } else {
            Reveal.next();
          }

        },
        context: '.notes'
      })
  }

  var _initilizeReveal = function() {

    reveal = Reveal.initialize({
      controls: true,
      progress: true,
      slideNumber: false,
      history: false,
      overview: true,
      center: true,
      touch: true,
      loop: false,
      rtl: false,
      fragments: true,
      embedded: false,
      help: true,
      showNotes: false,
      autoSlide: 0,
      autoSlideStoppable: true,
      mouseWheel: false,
      hideAddressBar: true,
      previewLinks: false,
      transition: 'default', // none/fade/slide/convex/concave/zoom
      transitionSpeed: 'default', // default/fast/slow
      backgroundTransition: 'default', // none/fade/slide/convex/concave/zoom
      viewDistance: 3,
      parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"
      parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"
      parallaxBackgroundHorizontal: null,
      parallaxBackgroundVertical: null
    });

    Reveal.configure({
      keyboard: {
        27: function() {
          return;
        },
      }
    });
  }

  var _setupPlyr = function() {
    var options = {
      controls: ["play", "current-time", "duration", "mute", "volume", "captions"]
    };

    $('.player').each(function(index){
      var player = plyr.setup(this, options);
      $(this).attr('data-video', index)
      players.push(player)

    });

  }

  var _splitPage = function() {
    $('.page-split')
      .split({
        orientation: 'vertical',
        limit: 1,
        position: '0%',
        onDrag: function() {
          _makeSlide()
        }
      });
  }

  var _makeSlide = function() {
    var width = $('.slides-content')
      .width() - 20
    $('.slide')
      .height(width * 9 / 16)
    $('.slide')
      .width(width)
    $('.slide')
      .css({
        height: width * 9 / 16,
        width: width,
        marginTop: -(width * 9 / 32),
        marginLeft: -(width / 2)
      })
  }

  var _getContent = function() {

    //dl.dropboxusercontent.com/u/139543118/EventChimp/eventchimp.md
    $.ajax({
      url: "data/eventchimp.html",
      method: 'GET',
      success: function(data) {
        $('.notes-content')
          .html(data);
      }
    })

  }

  _init();

})();

(function(d, p) {
  var a = new XMLHttpRequest(),
    b = d.body;
  a.open('GET', p, true);
  a.send();
  a.onload = function() {
    var c = d.createElement('div');
    c.setAttribute('hidden', '');
    c.innerHTML = a.responseText;
    b.insertBefore(c, b.childNodes[0]);
  };
})(document, 'images/sprite.svg');
