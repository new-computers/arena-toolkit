//-------------------
// append toolkit div
//-------------------

var arena_toolkit;
var arena_toolkit_container;

arena_toolkit = document.createElement("div");
arena_toolkit.setAttribute("id", "arena_toolkit");
arena_toolkit.setAttribute("class", "closed");

arena_toolkit.innerHTML = '<h7>Are.na Toolkit</h7><a id="arena_toolkit_resize" <a class="modalize-close js-modalize-close"><span class="iconic iconic-sm" data-glyph="x" title="x" aria-hidden="true"></span></a><div id="arena_toolkit_canvas"></div>';

document.body.appendChild(arena_toolkit);


//---------------
// resizing logic
//---------------

var arena_toolkit_resize = document.getElementById('arena_toolkit_resize');

arena_toolkit_resize.onclick = function() {
  if(arena_toolkit.classList.contains("closed")) {
    arena_toolkit.classList.add("open");
    arena_toolkit.classList.remove("closed");
  }
  else {
    arena_toolkit.classList.add("closed");
    arena_toolkit.classList.remove("open");
  }
}


//------------------
// fetch current url
//------------------

// send: content -> background
const send_content_background = 'message: content -> background'
chrome.runtime.sendMessage(
  { message: send_content_background },
  function(response) {
    if(response.message) {
      console.log(response.message)
    }
  }
);
