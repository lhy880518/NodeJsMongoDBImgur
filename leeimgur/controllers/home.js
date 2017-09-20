var sidebar = require('../helpers/sidebar');
var ImageModel = require('../models').Image;

//모듈 제작 선언
module.exports = {
  index: function(req, res){
    //res.render('index');
    //레이아웃 적용 안하려면 이렇게 사용하면됨
    //res.render('index', {layout: false});

    var viewModel = {
      images : []
    };

    console.log('This is home.index');

    //res.render('index', viewModel);

    //find(1번인자, 2번인자, 3번인자)
    //1번인자 : 실행되어질 쿼리
    //2번인자 : 결과를 어떻게 매핑할지 지정
    //3번인자 : options객체 정렬 필드와 방법을 설정가능(오름차순의 경우에는 1대신 -1사용)
    ImageModel.find({},{},{ sort: { timestamp: -1}},
      function(err, images){
        if(err){ throw err; }

        viewModel.images = images;
        console.log('images = '+images);
        console.log('viewModel.images = '+viewModel.images);
        console.log('11111111111viewModel = '+viewModel);

        sidebar(viewModel, function(viewModel){
          console.log('sidebar callback');
          console.log('viewModel.images22222222222222222222='+viewModel);
          res.render('index', viewModel);
        });
      });
  }
};
