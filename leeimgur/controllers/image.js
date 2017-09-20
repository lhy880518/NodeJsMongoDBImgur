var fs = require('fs');
var path = require('path');
var sidebar = require('../helpers/sidebar');
var Models = require('../models');
var md5 = require('MD5');


//모듈 제작 선언
//이름이 index, create, like, comment인 함수 선언
module.exports = {

  //1. 비어있는 viewModel을 새로 생성
  //2. 파일명의 정규식이 URL의 image_id 변수와 일치하는 모델을 반환하는 findOne 콜백 함수 생성
  //3. 검색에 성공한 이미지의 조회수 증가
  //4. 검색에 성공한 이미지를 viewModel에 저장
  //5. 조회수가 갱신되었으니 image모델을 갱신한다.
  //6. 원본 image 모델의 _id와 일치하는 image_id를 가진 모든 댓글을 반환한다.
  //7. 검색에 성공한 모든 댓글을 viewModel에 저장한다.
  //8. sidebar 모듈에 viewModel과 콜백 함수를 인자로 넘기면서 페이지를 그려준다.
  index: function(req, res){
    //params 프로퍼티는 요청의 body파싱 모듈의 일부인 urlencoded기능에 의해서 사용가능
    //res.send('The image:index controller ' + req.params.image_id);
    //res.render('image');

    /*var viewModel = {
      image: {
          uniqueId: 1,
          title: 'Sample Image 1',
          description: 'This is a sample.',
          filename: 'sample1.jpg',
          views:0,
          likes:0,
          timestamp: Date.now()
      },
      comments:[
        {
          image_id: 1,
          email: 'test@tesing.com',
          name: 'Test Tester',
          gravatar: 'http://lorempixel.com/75/75/animals/1',
          comment: 'This is a test comment...',
          timestamp: Date.now()
        },{
          image_id: 1,
          email: 'test@tesing.com',
          name: 'Test Tester',
          gravatar: 'http://lorempixel.com/75/75/animals/2',
          comment: 'Anotherr followup comment...',
          timestamp: Date.now()
        }
      ]
    };*/

    var viewModel = {
      image: {},
      comments: []
    };

    //findOne
    //regex는 like와 같다고 보면된다.
    console.log('++++++++++++++++++++index');
    Models.Image.findOne({ filename: { $regex: req.params.image_id}},
      function(err, image){
        if(err){ throw err;}

        if(image){
          console.log('++++++++++++++++++++index');
          //이미지를 찾으면 조회수 증가
          image.views = image.views +1;

          //viewModel에 이미지 저장
          viewModel.image = image;

          console.log('++++++++++++++++++++viewModel.image='+viewModel.image);
          console.log('++++++++++++++++++++image='+image);
          //변경돼었으므로 다시 저장
          image.save();

          //같은 image_id를 가진 댓글들을 검색
          Models.Comment.find({ image_id: image._id}, {}, {sort: { 'timestamp': 1}},
          function(err, comments){
            if(err){ throw err; }

            //viewModel에 댓글 컬렉션 저장
            viewModel.comments = comments;

            //viewModel과 같이 전송되는 사이드바 생성
            sidebar(viewModel, function(viewModel){
              //viewModel로 페이지 랜더링
              res.render('image', viewModel);
            });
          }
        );
        }else{
          //새로운 이미지를 찾지 못하면 홈페이지로 돌아감
          res.redirect('/');
        }
      });


    //res.render('image', viewModel);
    /*sidebar(viewModel, function(viewModel){
      res.render('image', viewModel);
    });*/
  },
  create: function(req, res){
    //이미지를 위해 식별자로 사용되는 고유의 이름을 생성하여야 한다.
    //업로드된 파일을 파일시스템에 저장하고 이미지 파일이 맞는지 확인해야 한다.
    //업로드가 끝나면 image/image_id 경로로 리다이렉트해 실제 상세 이미지를 보여준다.

    //res.send('The image:create POST controller');

    //1. 임의로 생성된 파일명이 기존 데이터베이스에 존재한다 하더라도 절대 덮어쓰지 않게 한다.
    //2. 이미지가 성공적으로 업로드되고 이름잉 변경된 뒤 파일시스템에 저장돼야만 데이터베이스에 이미지 정보를 삽입할것이다.
    var saveImage = function(){
      var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
      var imgUrl = '';

      for(var i=0 ; i<6 ; i+=1){
        imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      console.log('imgUrl = ' + imgUrl);


      Models.Image.find({fhilename: imgUrl }, function(err, images){
        if(images.length > 0){
          saveImage();
        }else{
          var tempPath = req.file.path;
          console.log('tempPath = ' + tempPath);
          var ext = path.extname(req.file.originalname).toLowerCase();
          console.log('ext = ' + ext);
          var targetPath = path.resolve('./public/upload/' + imgUrl + ext);
          console.log('targetPath = ' + targetPath);

          if(ext == '.png' || ext == '.jpg' || ext == '.jpeg' || ext == '.gif'){
            fs.rename(tempPath, targetPath, function(err){
              if(err) throw err;
              //res.redirect('/images/' + imgUrl);
              var newImg = new Models.Image({
                title: req.body.title,
                description: req.body.description,
                filename: imgUrl + ext
              });
              newImg.save(function(err, image){
                console.log('Successfully insert image : '+ image.filename);
                res.redirect('/images/' + image.uniqueId);
              });
            });
          }else{
            fs.unlink(tempPath, function(){
              if(err) throw err;
              res.json(500, {error: 'Only image files are allowd.'});
            });
          }
        }
      });


    };

    saveImage();

  },
  like: function(req, res){
    var viewModel = {
      image: {},
      comments: []
    };

    console.log('req.params.image_id='+req.params.image_id);

    Models.Image.findOne({ filename: { $regex: req.params.image_id}},
      function(err, image){
        if(err){ throw err;}

        if(image){

          //like를 클릭했을때의 내용이므로 likes 1증가
          image.likes = image.likes +1;

          //변경돼었으므로 다시 저장
          image.save(function(err, image){
            console.log('Successfully update image : '+ image.filename);
            res.json({likes: image.likes});
          });
        }else{
          //새로운 이미지를 찾지 못하면 홈페이지로 돌아감
          res.redirect('/');
        }
      });

    //res.json({likes: 1});
  },
  comment: function(req, res){
    Models.Image.findOne({ filename : { $regex: req.params.image_id }},
      function(err, image){
        if(!err && image){
          //configure.js에서 설정한 app.use(bodyParser()); 미들웨어를 여기서 사용
          //req.body
          var newComment = new Models.Comment(req.body);
          console.log("DOOO");
          console.log(req.body);
          //새롭게 등장한 MD5는 무엇인가?
          //md5는 해당 문자열을 해시 값으로 변경해주는 모듈
          newComment.gravatar = md5(newComment.email);
          newComment.image_id = image._id;
          newComment.save(function(err, comment) {
          if (err) { throw err; }

          res.redirect('/images/' + image.uniqueId + '#' + comment._id);
          });
        }else{
          res.redirect('/');
        }
      });
  },
  remove: function(req, res){
    //image_id로 이미지를 찾기
    Models.Image.findOne({ filename: { $regex: req.params.image_id }},
      function(err, image){
        if(err){
          throw err;
        }

        //실제 파일 저장된거 삭제
        fs.unlink(path.resolve('./public/upload/' + image.filename),
        function(err){
          if(err) { throw err; }

          //Comment collection에 id로 검색해서 삭제 처리
          Models.Comment.remove({ image_id: image._id},
            function(err){
              //Comment 삭제 처리 후 이미지 collection 삭제 처리
              image.remove(function(err){
                if(!err){
                  res.json(true);
                }else{
                  res.json(false);
                }
              });
            }
          );
        });
      }
    );
  }
};
