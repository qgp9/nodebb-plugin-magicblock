'use strict';

let jsYAML = require('js-yaml');
// NodeBB modules
let	meta = module.parent.require('./meta');

// Plugin modules
let controllers = require('./lib/controllers');
let adminNavigation = require( './lib/adminNavigation' );
let MagicBlock      = require( './lib/magicBlock/index' );
let options         = require( './lib/magicBlock/options' );
let defaults        = require( './lib/defaults' );

var magicBlockOpts = {} ;
let magicBlock;


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
  // let hostControllers = params.controllers;

  router.get('/admin/plugins/magicblock', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
  router.get('/api/admin/plugins/magicblock', controllers.renderAdminPage);


  let storedOptions;
  meta.settings.get('magicblock', function(err, opts){
    if( opts.hasOwnProperty('fullOptions') && typeof opts.fullOptions === 'string' ){
      let fullOptions = opts.fullOptions;
        console.log( fullOptions );
      try {
        storedOptions = jsYAML.safeLoad(fullOptions);
      } catch (e) {
        console.error(e);
      }
        console.log( fullOptions );
        console.log( typeof fullOptions );
    }
    // TODO: for( let field in opts ){ options[field] = opts[field]; }
    // TODO: if options on DB is empty, fill it with defaults
    magicBlockOpts = options.build( storedOptions, defaults.value );
    magicBlock = new MagicBlock(magicBlockOpts);
  });

  cb();
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
