// bind input
document.getElementById('send').addEventListener('click', function(){
  var user = document.getElementById('username').value;
  var msg = document.getElementById('message').value;
  fetch("./chat", {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: user,
      msg:  msg
    })
  })
  .then(function(resp){
    document.getElementById('message').value = '';
  });
});

// bind output
var source = new EventSource('/list/');
source.onmessage = function(e){
  var out = document.getElementById('out');
  var prev = out.innerHTML;
  var data = JSON.parse(e.data);
  var result = `<${data.time}> [${data.user}] ${data.msg}`;
  out.innerHTML = result + '\n' + prev;
}
