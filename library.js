'use strict';

// NodeBB modules
let	meta = module.parent.require('./meta');

// Plugin modules
let controllers = require('./lib/controllers');
let adminNavigation = require( './lib/adminNavigation.js' );
let MagicBlock      = require( './lib/magicBlock/index' );

let magicBlock;
var magicBlockOpts = {} ;

/* ======================== Exports  ========================*/
exports.init = init;
exports.addAdminNavigation = adminNavigation.addAdminNavigation;

exports.parsePost = parsePost;
exports.parseSignature = parseSignature;
exports.parseRaw = parseRaw;

/* ======================== function  ========================*/
function init (params, cb) {
  let router = params.router;
  let hostMiddleware = params.middleware;
  let options = {};
  // let hostControllers = params.controllers;

  router.get('/admin/plugins/magicblock', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
  router.get('/api/admin/plugins/magicblock', controllers.renderAdminPage);

  magicBlock = new MagicBlock();
  meta.settings.get('magicblock', function(err, opts){
    for( let field in opts ){
      options[field] = opts[field];
    }
  });
  cb()
}


function parseRaw (data, cb) {
  if (data && typeof data === 'string') {
    data = magicBlock.parse(data);
  }
  cb(null, data);
}

function parsePost (data, cb) {
  if (data && data.postData && data.postData.content) {
    data.postData.content = magicBlock.parse(data.postData.content);
  }
  cb(null, data);
}

function parseSignature (data, cb) {
  if (data && data.userData && data.userData.signature) {
    data.userData.signature = magicBlock.parse(data.userData.signature);
  }
  cb(null, data);
}
