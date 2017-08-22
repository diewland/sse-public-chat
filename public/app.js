// bind input
document.getElementById('send').addEventListener('click', function(){
  var u = document.getElementById('username').value;
  var m = document.getElementById('message').value;
  fetch('./chat?u='+ u +'&m='+ m).then(function(){
    document.getElementById('message').value = '';
  });
});

// bind output
var source = new EventSource('/list/');
source.onmessage = function(e){
  var out = document.getElementById('out');
  var prev = out.innerHTML;
  out.innerHTML = e.data + '\n' + prev;
}
