var models = require('../models');
var async = require('async');

//모듈 정의
module.exports = function(callback){
  /*var stats = {
    images: 0,
    comments: 0,
    views: 0,
    likes: 0
  };
  return stats;*/
  async.parallel([
    function(next){
      //next(null, 0);
      //models.Image.count({}, next);
      models.Image.count({}, function(err, total){
        next(err, total);
      });
    },
    function(next){
      models.Comment.count({}, function(err, total){
        next(err, total);
      });
    },
    function(next){
      models.Image.aggregate({ $group : {
        _id: '1',
        viewsTotal: { $sum : '$views' }
      }}, function(err, result){
        var viewsTotal = 0;
        if(result.length > 0){
          viewsTotal += result[0].viewsTotal;
        }
        next(null, viewsTotal);
      });
    },
    function(next){
      //next(null, 0);
      models.Image.aggregate({ $group : {
        _id: '1',
        likesTotal: { $sum : '$likes' }
      }}, function(err, result){
        var likesTotal = 0;
        if(result.length > 0){
          likesTotal += result[0].likesTotal;
        }
        next(null, likesTotal);
      });
    }
  ], function(err, results){
    callback(null, {
      images: results[0],
      comments: results[1],
      views: results[2],
      likes: results[3]
    });
  });
};
