const content='<div id="evdlgc">チャンネル:</div><br>時刻<input type="number" id="evdlgh" min=0 max=23></input>:<input type="number" id="evdlgm" min=0 max=59 step=10></input><br>デューティ<input type="number" id="evdlgd" min=0 max=100 step=5></input>%';

function editDialog(elm,col,tm,val){
    elm.html(content);
    console.log("dialog",tm,val);
    let hour=Math.floor(tm);
    let min=Math.floor((tm-hour)*60);
    $('#evdlgc').append(col.toString());
    $('#evdlgh').val(hour);
    $('#evdlgm').val(min);
    $('#evdlgd').val(val);
    return new Promise((resolve)=>{
      elm.dialog({
        width:'350px',
        modal:true,
        open: function () { $(".ui-dialog-titlebar-close").hide(); },
        title:"イベント編集",
        buttons: {
            "削除": function(){
		 	       $(this).dialog("close");
            resolve(['delete']);
  		      },
  	       "更新": function(){
            let hour=Number($('#evdlgh').val());
            let min=Number($('#evdlgm').val());
            let val=Number($('#evdlgd').val());
            $(this).dialog("close");
            resolve(['ok',hour+min/60,val]);
            },
	          "取消": function(){
		 	       $(this).dialog("close");
            resolve(['cancel']);
		        },
          }
       });
     });
}

function createDialog(elm,col,tm,val){
    elm.html(content);
    console.log("dialog",tm,val);
    let hour=Math.floor(tm);
    let min=Math.floor((tm-hour)*60);
    $('#evdlgc').append(col.toString());
    $('#evdlgh').val(hour);
    $('#evdlgm').val(min);
    $('#evdlgd').val(val);
    return new Promise((resolve)=>{
      elm.dialog({
        modal:true,
        open: function () { $(".ui-dialog-titlebar-close").hide(); },
        title:"新規イベント",
        buttons: {
  	       "作成": function(){
            let hour=Number($('#evdlgh').val());
            let min=Number($('#evdlgm').val());
            let val=Number($('#evdlgd').val());
            $(this).dialog("close");
            resolve(['ok',hour+min/60,val]);
            },
	          "取消": function(){
		 	       $(this).dialog("close");
            resolve(['cancel']);
		        }
          }
       });
     });
}

export {editDialog,createDialog};

