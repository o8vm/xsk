function createXMLHttpRequest(){
  if(window.XMLHttpRequest){return new XMLHttpRequest()}
  if(window.ActiveXObject){
    try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}
    try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}
    try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}
  }
  return false;
}

function stub(path) {
  var url,xhr,to;
  url = '/.attachments/sh/stub.sh';
  xhr = createXMLHttpRequest();
  if (! xhr) {return;}
  to =  window.setTimeout(function(){xhr.abort()}, 30000);
  xhr.onreadystatechange = function(){stub_callback(xhr,to)};
  xhr.open('GET' , url+'?path='+path+'&dummy='+(new Date)/1, true);
  xhr.send(null); 
}

function stub_callback(xhr,to) {
  var str, info;
  if (xhr.readyState === 0) {alert('time out');}
  if (xhr.readyState !== 4) {return;                     } 
  window.clearTimeout(to);
  if (xhr.status === 200) {
    str = xhr.responseText;
    info = document.querySelector('#stub');
    info.contentDocument.open();
    info.contentDocument.write(str);
    info.contentDocument.close();
  } else {
    alert('Exoskeleton returned an incorrect response');
  }
}

var resize = function() {
  REF = document.querySelector('#stub');
  var myC = REF.contentWindow.document.documentElement;
  var myH = 500;
  if(document.all) {
    myH = myC.scrollHeight;
  } else {
    myH = myC.offsetHeight;
  }
  REF.style.height = myH + 'px';
}

