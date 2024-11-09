var a = 0;
$('.like').click(function () {
  if(a == 0){
    $(this).append('<span class="coin">+1</span>');
    a++;
  }else{
    $(this).append('<span class="coin">-1</span>');
    a = 0;
  }
});