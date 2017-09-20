var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');

//controllers내부에 있는 home.js파일을 모듈로 선언
var home = require('../controllers/home');

//controllers내부에 있는 image.js파일을 모듈로 선언
var image = require('../controllers/image');

var upload = multer({ dest: path.join(__dirname, 'public/upload/temp') });

module.exports = function(app){
  console.log('This is Route.function()');
  // /로 페이지 호출하게되면 home모듈에 의 index함수를 호출
  router.get('/', home.index);
  router.get('/images/:image_id', image.index);
  router.post('/images',upload.single('file') ,image.create);
  router.post('/images/:image_id/like', image.like);
  router.post('/images/:image_id/comment', image.comment);
  //삭제 기능 추가
  router.delete('/images/:image_id', image.remove);
  app.use(router);
};
