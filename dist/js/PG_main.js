var myInterval = setInterval(checkinterval, 100);
var starttype = 0;
var textmain = null;

function checkinterval() {
  if (document.querySelectorAll('[data-testid="tweetTextarea_0RichTextInputContainer"]').length > 0) {
    clearInterval(myInterval);
    start();
  }
}

function loadScript(url, callback) {
  var head = document.head;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onreadystatechange = callback;
  script.onload = callback;
  head.appendChild(script);
}

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

function start() {
  var el = document.createElement('div');
  el.setAttribute('id', 'circle');
  el.setAttribute('class', 'animate-wiggle');
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.src = "https://brandonbrule.github.io/itsa/js/itsa.js";
  script.type = 'text/javascript';
  var jq = document.createElement('script');
  jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
  jq.type = 'text/javascript';
  head.appendChild(script);
  head.appendChild(jq);
  document.querySelectorAll('[data-testid="tweetTextarea_0RichTextInputContainer"]')[0].appendChild(el);
}

function debounce(callback, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      callback.apply(this, args);
    }, wait);
  };
}

window.addEventListener('keyup', debounce(() => {
  starttype = 1;
  for (var i = 0; i < document.querySelectorAll('[data-text="true"]').length; i++) {
    textmain = document.querySelectorAll('[data-text="true"]')[i].innerHTML;
    if (document.querySelectorAll('[data-text="true"]')[i].innerHTML.length > 0) {
      (function () {
        var paragraphs = ["1"];
        var c = {
          s: '#FF80AB'
        };

        var offset = 0;
        var contrt = 0;
        [].forEach.call(paragraphs, function () {
          if (i > 0 && document.querySelectorAll('[data-text="true"]')[i - 1].innerHTML.split(' ').length % 2 == 0) {
            var sentences = document.querySelectorAll('[data-text="true"]')[i].innerHTML.split(' ');
            var html = [];

            [].forEach.call(sentences, function (sentence) {
              if (contrt % 2 == 0) {
                offset = offset + 1;
                html.push('<mark class="offset-' + offset + '"  style="background:' + c.s + '; border-bottom: 5px solid #F50057">' + sentence + '</mark>');

              } else {
                

                html.push(sentence);

              }
              contrt = contrt + 1


            });
            document.querySelectorAll('[data-text="true"]')[i].innerHTML = html.join(' ');
          } else {
            var sentences = document.querySelectorAll('[data-text="true"]')[i].innerHTML.split(' ');
            var html = [];
            [].forEach.call(sentences, function (sentence) {
              if (contrt % 2 == 1) {
                offset = offset + 1;
                html.push('<mark class="offset-' + offset + '"  style="background:' + c.s + '; border-bottom: 5px solid #F50057">' + sentence + '</mark>');

              } else {

                html.push(sentence);

              }
              contrt = contrt + 1


            });

            document.querySelectorAll('[data-text="true"]')[i].innerHTML = html.join(' ');

          }

        });

      })();

      function reverseString(p) {
        return p.split("").reverse().join("");
      }


      $("[data-text='true']").click(function (e) {
        var s = window.getSelection();
        var range = s.getRangeAt(0);
        var node = s.anchorNode.data;
        console.log(toString(node));
        range['startContainer']['parentElement'].innerHTML = reverseString(node);

      });


    }

  }
}, 4000))


window.addEventListener('keyup', debounce(() => {

  if (starttype == 1) {
    starttype = 0;
	 for (var i = 0; i < document.querySelectorAll('[data-text="true"]').length; i++) {
    document.querySelectorAll('[data-text="true"]')[i].innerHTML = textmain;
	 }
  }

}, ))