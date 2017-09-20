var Stats = require('./stats');
var Images = require('./images');
var Comments = require('./comments');
var async = require('async');

module.exports = function(viewModel, callback){
  /*viewModel.sidebar = {
    stats: Stats(),
    popular: Images.popular(),
    comments: Comments.newest()
  };

  callback(viewModel);*/
  async.parallel([
    function(next){
      //next(null, Stats());
      Stats(next);
    },
    function(next){
      //next(null, Images.popular());
      Images.popular(next);
    },
    function(next){
      Comments.newest(next);
    }
  ], function(err, results){
    console.log('results[0]='+results[0]);
    console.log('results[1]='+results[1]);
    console.log('results[2]='+results[2]);
    viewModel.sidebar = {
      stats: results[0],
      popular: results[1],
      comments: results[2]
    };

     callback(viewModel);
  });
};
