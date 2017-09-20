//소스코드 디스커버리
var path = require('path');
var exphbs = require('express-handlebars');
var express = require('express');
var bodyParser = require('body-parser'); // HTML 양식을 통해 제출된 양식 데이터의 해석을 도와줌
var cookieParser = require('cookie-parser'); // 쿠키를 보내고 받을 수 있게 해준다
var morgan = require('morgan'); // 로깅담당 모듈, 노드 서버 디버깅용
var methodOverride = require('method-override');
var errorHandler = require('errorhandler'); // 에러 핸들러
var moment = require('moment');


//직접 만든 모듈인 routes.js를 모듈로 선언
var routes = require('./routes');

//server.js 의 app = config(app); 이 방식으로 아래 함수를 호출
module.exports = function(app){
  //app.use로 미들웨어 사용을 선언한다.
  //미들웨어? :  요청에 대한 응답 과정 중간에 껴서 어떠한 동작을 해주는 프로그램.
  //익스프레스는 요청이 들어올 때 그에 따른 응답을 보내준다.
  //응답을 보내기 전에 미들웨어가 지정한 동작을 수행.
  //Morgan : 익스프레스 프레임워크가 동작하면서 나오는 메세지들을 콘솔에 표시해줌
  //Compression : 페이지를 압축해서 전송해줌.
  app.use(morgan('dev'));

  //body-parser : 폼에서 전송되는 POST값을 사용가능하도록 해줌
  //app.use(bodyParser({
    //uploadDir:path.join(__dirname, 'public/upload/temp')
  //}));
  //app.use(bodyParser.urlencoded({'extended' : true}));
  //app.use(bodyParser.json());
  //app.use(bodyParser());
  //app.use(multer({ dest: path.join(__dirname, 'public/upload/temp')}));
  //app.use(multer({ dest: path.join(__dirname, 'public/upload/temp')}));
  app.use(bodyParser());


  //method-override : REST API에서 PUT과 DELETE메소드를 사용할 수 있게 해줌
  app.use(methodOverride());

  //cookie-parser : 쿠기값을 사용가능하도록
  app.use(cookieParser('some-secret-value-here'));

  //routes.js내부의 함수를 호출
  routes(app);
  /*module.exports = function(app){
    // /로 페이지 호출하게되면 home모듈에 의 index함수를 호출
    router.get('/', home.index);
    router.get('/images/:image_id', image.index);
    router.post('/images', image.create);
    router.post('/images/:image_id/like', image.like);
    router.post('/images/:image_id/comment', image.comment);
    app.use(router);
  };*/
  //라우팅의 내용은 위와 같은데 기본 호출시에 home.index 를 호출한다.
  /*module.exports = {
    index: function(req, res){
      res.render('index');
      //레이아웃 적용 안하려면 이렇게 사용하면됨
      //res.render('index', {layout: false});
    }
  };*/
  //home.js는 위와 같은데 render을 사용하여 index.handlebars를 호출한다.
  //그러면 {{{body}}} == 라우팅 시의 /란 것인가 이것도 궁금하네
  //또한 index.handlebars의 위치는??
  //위치 테스트 1: res.render('./layouts/index'); index.handlebars를 layouts에 옮겨놓으면 정상작동함
  //위치 테스트 2: res.render('./index'); index.handlebars가 views안에 있으면 정상작동
  //결론 : res.render()에서 기본 위치는 views 내부이다.
  //app.set('views', __dirname + '/view'); views로 설정은 하였으나 위치를 view로 했기때문에 기존으로는 안됨
  //views로 하여서 폴더명을 바꾸든 하는건 가능하다.
  //app.set('view', __dirname + '/views');
  //set view는 안된다. views만 된다.

  //Express 정적 파일 제공
  //http://localhost:3300/public/img/test.jpg 요런식으로 웹에서 호출하면됨
  app.use('/public/', express.static(path.join(__dirname, '../public')));
  //path.join메소드를 사용하면 디렉토리 주소 구분자가 /인지 \인지 상관없이 환경에 맞게 주소를 완성해줌
  console.log('111111111111111:'+path.join(__dirname, '../public'));
  //C:\Users\admin\leeimgur\public
  console.log('111111111111111:'+path.join(__dirname, '/public'));
  //C:\Users\admin\leeimgur\server\public


  if('development' === app.get('env')){
    app.use(errorHandler());
  }

  //이분페이지에 설명이 잘 나와있다. http://suseok.egloos.com/4259624
  //html파일마다 동일하게 <html>태그로 시작하여 여러 줄의 동일한 코드들을
  //반복하여 타이핑하는데 handlebars 모듈은 하나의 layout파일을 정의해 두고
  //layout파일 내부에 view들을 랜더링 해주는 모듈.
  app.engine(
    'handlebars', exphbs.create({
      defaultLayout: 'main',//디폴트 레이아웃명.handlebars 가 호출되도록 설정
      //layoutsDir : The string name or path of a template in the layoutsDir to use as the default layout
      //디폴트 레이아웃의 위치 설정
      layoutsDir: app.get('views') + '/layouts',// server.js에서 app.set('views')를 설정 해 둠
      partialsDir: [app.get('views') + '/partials'],
      helpers:{
        timeago: function(timestamp){
          return moment(timestamp).startOf('minute').fromNow();
        }
      }
    }).engine);

    //handlebars등록 근데 이거는 좀더 알아봐야겠다.
    //나는 확장자를 설정하는건줄 알았는데 handlebar사용의 기본규칙일지도..
    //핸들바 사용 일반 규칙이라고 하고 넘어가련다.
    app.set('view engine', 'handlebars');

  return app;
};
