//$(document).ready(function(){
//를 축약한게 아래 코드
$(function(){
  var commentFlag = true;
  $('#post-comment').hide();
  $('#btn-comment').on('click', function(event){
    if(commentFlag){
      $('#post-comment').show();
      commentFlag = false;
    }else{
      $('#post-comment').hide();
      commentFlag = true;
    }

  });

  $('#btn-like').on('click', function(event){
    event.preventDefault();

    var imgId = $(this).data('id');

    $.post('/images/' + imgId + '/like').done(function(data){
      $('.likes-count').text(data.likes);
    });
  });

  $('#btn-delete').on('click', function(event){
    event.preventDefault();

    var $this = $(this);

    var remove = confirm('Are you sure you want to delete this image?');

    if(remove){
      var imgId = $(this).data('id');
      //JQuery라이브러리를 이용하여 ajax기법 사용
      $.ajax({
        url: '/images/' + imgId,
        type: 'DELETE'
      }).done(function(result){
        if(result){
          //삭제 완료 하게되면 버튼 색상 변경
          $this.removeClass('btn-danger').addClass('btn-success');
          $this.find('i').removeClass('fa-times').addClass('fa-check');
          $this.append('<span> Deleted! </span>');
        }
      });
    }


  });
});
