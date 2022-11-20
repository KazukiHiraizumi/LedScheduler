let cb_receive;
let cb_repeat;
let cb_discon;
let tm_repeat;

export function openSock(rcv,rpt,dcn){
  cb_receive=rcv;
  cb_repeat=rpt;
  cb_discon=dcn;
  let socket = new WebSocket("ws://localhost:8001");
  socket.onopen = function(e) {
    console.log("[open] Connection established");
    tm_repeat=setInterval(()=>{
      let msg=cb_repeat();
      socket.send(JSON.stringify(msg));
    },1000);
  };

  socket.onmessage = function(event){
    let resp=JSON.parse(event.data);
    cb_receive(resp);
  };

  socket.onclose = function(event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    }
    else {
      console.log('[close] Connection died');
    }
   cb_discon();
   clearInterval(tm_repeat);
  };

  socket.onerror = function(error) {
    console.log(`[error] ${error.message}`);
    clearInterval(tm_repeat);
  };

  return socket;
}

