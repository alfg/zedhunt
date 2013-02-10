
/*
 * GET home page.
 */

var db = require('../db.js')

exports.index = function(req, res){
  res.render('find', { title: 'Express' });
};
