var $ = function(selector){return document.querySelector(selector)};

var a = $('#run');
var out = function(item){
    $('#result').innerHTML += item+"<br />";
}
if(localStorage.getItem('s10')){
     $('textarea').value = localStorage.getItem(s10);
}
a.addEventListener('click', function (event) {
    var value = $('textarea').value;
    eval(value);
});

$('#reset').addEventListener('click', function(event){
    localStorage.set('s10',  $('textarea').value)
    history.go(0);
})