import {editDialog,createDialog} from "./mod/evdlg2.js"
import {renderPanel,renderHeading,updatePanel,checkPanel} from "./mod/evmon.js"
import {openSock} from "./mod/evsock.js"
import {fsOpen,fsSave} from "./mod/evfs-json.js"

$('button').on('mousedown',function(ev){
  $(ev.target).css({"transform":"scale(0.9,0.9)"});
});
$('button').on('mouseup',function(ev){
  $(ev.target).css({"transform":"scale(1,1)"});
});
$('button').on('mouseleave',function(ev){
  $(ev.target).css({"transform":"scale(1,1)"});
});

let appData={
  headers: ['0','1','2','3','4','5','6','7'],
  cardTemplate: '<div>${value}%</div>',
  lineHeight: 20,
}

function blinker(elm){
  return setInterval(function(){
    elm.fadeOut(500,function(){$(this).fadeIn(500)});
  },1000);
}

let blinker_connect=blinker($('#connect'));
let blinker_upload=0;

function save(){
  let jstr=JSON.stringify(appData.tasks.filter(function(task){
    return task.hasOwnProperty('id');
  }));
  localStorage.setItem('evresume',jstr);
  blinker_upload=blinker($('#upload'));
}

function build(tasks) {
  Object.assign(appData,{
    tasks: tasks,
    onClick: async function (e, t) {
      let resp=await editDialog($("#dialog1"),t.task.column,t.task.startTime,t.task.value);
      if(resp[0].startsWith('ok')){
        t.task.startTime=resp[1];
        t.task.value=resp[2];
        t.card.updateAttr(t.task);
        save();
       }
      else if(resp[0].startsWith('del')){
        appData.tasks.forEach(function(task,index){
          if(task.id == t.task.id){
            appData.tasks.splice(index,1);
            }
         });
        t.card.remove();
        save();
       }
	   },
    onCreate: async function(e, t){
       console.log("Create",JSON.stringify(t));
       let tm=Math.floor(t.yPos/appData.lineHeight/2);
       let resp=await createDialog($("#dialog1"),t.column,tm,0);
       console.log('Create dialog resp',resp.toString());
       if(resp[0].startsWith('ok')){
         let task={  //initial value
           startTime: resp[1],
           duration: 0,
           column:t.column,
           value: resp[2],
           id:Math.floor(Math.random()*1000000)
          };
         appData.tasks.push(task);
         save();
         console.log("Create OK",appData.tasks.length);
         $("#skeduler-container").skeduler(appData);
        }
     }
  });
  $("#skeduler-container").skeduler(appData);
}

function resume(){
  try{
    let jstr=localStorage.getItem('evresume');
    console.log('resume',jstr);
    let tasks=JSON.parse(jstr);
    build(tasks);
  }
  catch(e){
    console.log('Resume Failed');
    build([]);
  }
}

let sock=openSock(
  function(pack){   //receive callback
    if(pack.action=='dump'){
      clearInterval(blinker_connect);
      $('#connect').css({'background-image':'url(icons/connect.png)'});
      updatePanel(pack.events);
    }
    else if(pack.action=='upload'){
      build(pack.events);
    }
  },
  function(){  //repeating callback
    let events=checkPanel();
    console.log('repeat',JSON.stringify(events));
    let pack={'action':'dump','events':events};
    return pack;
  },
  function(){  //discon callback
    blinker_connect=blinker($('#connect'));
    $('#connect').css({'background-image':'url(icons/disconnect.png)'});
  }
);

function upload(){
  let pack={'action':'upload','events':appData.tasks};
  console.log('upload',pack);
  console.log('dovk',sock.readyState);
  if(sock.readyState==1){
    sock.send(JSON.stringify(pack));
    clearInterval(blinker_upload);
  }
}
function download(){
  let pack={'action':'download'};
  if(sock.readyState==1){
    sock.send(JSON.stringify(pack));
    clearInterval(blinker_upload);
  }
}

$('#upload').on('click',upload);
$('#download').on('click',download);

renderPanel($('#panel'),appData.headers);
renderHeading($('#header'),appData.headers);
await fsOpen($('#file_open'),(contents)=>{
  let tasks=JSON.parse(contents);
  build(tasks);
  blinker_upload=blinker($('#upload'));
});
await fsSave($('#file_save'),async ()=>{
  let jstr=JSON.stringify(appData.tasks.filter(function(task){
    return task.hasOwnProperty('id');
  }));
  return jstr;
});

resume();

console.log('skeduler',$.skeduler);

