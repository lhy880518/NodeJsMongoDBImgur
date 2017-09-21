//이 파일에서는 서버를 띄우기 위한 기본적인 작업 진행
var express = require('express');

//직접 만든 파일인 configure.js를 모듈로 선언한다.
var config = require('./server/configure');

var app = express();

var mongoose = require('mongoose');

//process.env.PORT = 실제 장비의 서버에 할당된 기본 포트 번호
//설정되어 있지 않다면 기본 3300으로 설정
app.set('port', process.env.PORT || 3300);

//view의 위치 지정
//__dirname = The directory name of the current module 전역변수인데 디렉토리 위치임
app.set('views', __dirname + '/views');

//선언한 모듈의 함수를 호출한다.
//요기 호출부분만 없애면 그냥 단순 웹서버 구동소스임
//함수 호출을 하였는데 위의 var config = require('./server/configure'); 이걸따라서 configure.js를 살펴보러 이동
app = config(app);

//mongoose.connect('mongodb://localhost/leeimgur');
mongoose.connect('mongodb://lhy880518:7164gusdyd@ds143744.mlab.com:43744/leeimgur');
mongoose.connection.on('open', function(){
  console.log('Mongoose connected.');
});

//app.get('/', function(req,res){
//  res.send('SERVER JS IS OPEN');
//});

var server = app.listen(app.get('port'), function(){
  console.log('Server up : http://localhost:' + app.get('port'));
});
