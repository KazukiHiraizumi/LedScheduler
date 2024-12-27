let tm_turnoff=null;
let pvContainer;
let svContainer;
let parentContainer;

function renderPanel(elm,headers){
  let div = $('<div></div>');
  pvContainer = div.clone().addClass('skeduler-headers');
  svContainer = div.clone().addClass('skeduler-headers');
  pvContainer.append($('<div style="font-size:0.7em;">現在値</div>'));
  svContainer.append($('<div style="font-size:0.7em;">強制出力</div>'));
  headers.forEach(function (element) {
    let pv=div.clone();
    let disp=div.clone();
    pv.append(disp);
    pvContainer.append(pv);
    let sv=div.clone();
    let inp=$('<input type="number" min=0 max=100 step=10 value=0>%</input>');
    let chk=$('<input type="checkbox" value=1></input>');
    sv.append(chk);
    sv.append(inp);
    svContainer.append(sv);
  }, this);
  elm.append(pvContainer);
  elm.append(svContainer);
}

function updatePanel(data){
  if(tm_turnoff!=null) clearTimeout(tm_turnoff);
  data.forEach(function(ev){
    pvContainer.children().eq(ev.column).text(ev.value+' %');
  });
}

function checkPanel(){
  let events=[];
  svContainer.children().each(function(n,elm){
    let contents=$(elm).children();
    let flag=contents.eq(0).prop('checked');
    let val=contents.eq(1).val();
    if(flag){
      events.push({column:n,value:val});
    }
  });
  return events;
}

function renderHeading(elm,headers){
  let div = $('<div></div>');
  let headerContainer = div.clone().addClass('skeduler-headers');
  headerContainer.append($('<div>CH</div>'));
  headers.forEach(function (element) {
    div.clone().text(element).appendTo(headerContainer);
  }, this);
  elm.append(headerContainer);
  parentContainer=elm;
}

export {renderPanel,updatePanel,checkPanel,renderHeading}

