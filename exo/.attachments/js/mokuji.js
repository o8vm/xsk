document.addEventListener('DOMContentLoaded', function() {
  TableOfContents();
}
);                        


function TableOfContents(container, output) {
var toc = "";
var level = +1;
var container = document.querySelector(container) || document.querySelector('#contents');
var output = output || '#toc';

container.innerHTML =
  container.innerHTML.replace(
    /<h([2345])>([^<]+)<\/h([\d])>/gi,
    function (str, openLevel, titleText, closeLevel) {
      if (openLevel != closeLevel) {
        return str;
      }
      if (openLevel > level) {
        toc += (new Array(openLevel - level + 1)).join('<ul>');
      } else if (openLevel < level) {
        toc += (new Array(level - openLevel + 1)).join('</li></ul>');
      } else {
        toc += (new Array(level+ 1)).join('</li>');
      }

      level = parseInt(openLevel);

      var anchor = titleText.replace(/ /g, "_");
      toc += '<li><a href="#' + anchor + '">' + titleText
          + '</a>';

      return '<h' + openLevel + '><a href="#' + anchor + '" id="' + anchor + '">'
        + titleText + '</a></h' + closeLevel + '>';
    }
  );

if (level) {
  toc += (new Array(level + 1)).join('</ul>');
}
document.querySelector(output).innerHTML += toc;
};

function scrollTop(elem,duration) {
let target = document.getElementById(elem);
target.addEventListener('click', function() {
let currentY = window.pageYOffset; 
let step = duration/currentY > 1 ? 10 : 100;
let timeStep = duration/currentY * step;
let intervalID = setInterval(scrollUp, timeStep);
function scrollUp(){
currentY = window.pageYOffset;
if(currentY === 0) {
clearInterval(intervalID);
} else {
scrollBy( 0, -step );
}
}
});
}
