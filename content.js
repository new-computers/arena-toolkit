//-------------------
// append toolkit div
//-------------------

var arena_toolkit = document.createElement("div");
arena_toolkit.setAttribute("id", "arena_toolkit");
document.body.appendChild(arena_toolkit);


//--------------
// attatch tools
//--------------

function newTool(tool_name) {

  var arena_tool;

  arena_tool = document.createElement("div");
  arena_tool.setAttribute("class", "arena_tool arena_tool_closed");
  arena_tool.setAttribute("id", tool_name);
  arena_tool.innerHTML = '<a class="arena_tool_resize" <a class="modalize-close js-modalize-close"><span class="iconic iconic-sm" data-glyph="x" title="x" aria-hidden="true"></span></a><div class="arena_tool_canvas"></div>';
  arena_toolkit.appendChild(arena_tool);
}

newTool("print");

newTool("maps");

newTool("radio");


//---------------
// resizing logic
//---------------

let arena_toolkit_tool = document.getElementsByClassName('arena_tool');

Object.keys(arena_toolkit_tool).map((key, index) => {
  arena_toolkit_tool[key].onclick = function() {
    if(arena_toolkit_tool[key].classList.contains("arena_tool_closed")) {
      arena_toolkit_tool[key].classList.add("arena_tool_open");
      arena_toolkit_tool[key].classList.remove("arena_tool_closed");
    }
    else {
      arena_toolkit_tool[key].classList.add("arena_tool_closed");
      arena_toolkit_tool[key].classList.remove("arena_tool_open");
    }
  }
});


//--------------------
// update notification
//--------------------

function updateNotification(message, duration) {
  var updated = document.createElement("h3");
  updated.setAttribute("class", "arena_toolkit_updated arena_toolkit_updated_hidden");
  updated.innerHTML = message;
  setTimeout(function(){
    updated.classList.remove("arena_toolkit_updated_hidden");
    updated.classList.add("arena_toolkit_updated_visible");
  }, 100);
  setTimeout(function(){
    updated.classList.add("arena_toolkit_updated_hidden")
  }, duration - 1000);
  setTimeout(function(){
    updated.parentNode.removeChild(updated);
  }, duration);
  document.body.appendChild(updated);
}

updateNotification("reloaded", 4000);
