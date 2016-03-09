'use strict';

let jsYAML = require('js-yaml');
// NodeBB modules
let	meta = module.parent.require('./meta');

// Plugin modules
let controllers = require('./lib/controllers');
let adminNavigation = require( './lib/adminNavigation' );
let MagicBlock      = require( './lib/magicblock/index' );
let options         = require( './lib/magicblock/options' );
let defaults        = require( './lib/defaults' );

var magicBlockOpts = {} ;
let magicBlock;

// BEGIN hackIframely
let hackIframely = false;
// END 


/* ======================== Exports  ========================*/
exports.init = init;
exports.addAdminNavigation = adminNavigation.addAdminNavigation;

exports.parsePost = parsePost;
exports.parseSignature = parseSignature;
exports.parseRaw = parseRaw;

exports.afterIframelyRaw = afterIframelyRaw;  // For hackIframely
exports.afterIframelypost = afterIframelypost; // For hackIframely

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
      //console.log( fullOptions );
      try {
        storedOptions = jsYAML.safeLoad(fullOptions);
      } catch (e) {
        console.error(e);
      }
      //console.log( fullOptions );
      //console.log( typeof fullOptions );
    }
    // TODO: for( let field in opts ){ options[field] = opts[field]; }
    // This is for MagicBlock module. don't need this yet
    // magicBlockOpts = options.build( storedOptions, defaults.value );
    magicBlockOpts = storedOptions;
    magicBlock = new MagicBlock(magicBlockOpts);
    if( storedOptions ) hackIframely = storedOptions.hackIframely; // For hackIframelyBefore
  });

  cb();
}


function parseRaw (data, cb) {
  if (data && typeof data === 'string') {
    if( hackIframely )data = hackIframelyBefore( data ); // For hackIframely
    data = magicBlock.parse(data);
  }
  cb(null, data);
}

function parsePost (data, cb) {
  if (data && data.postData && data.postData.content) {
    let con = data.postData.content;
    if( hackIframely ) con = hackIframelyBefore( con ); // For hackIframely
    data.postData.content = magicBlock.parse(con);
  }
  cb(null, data);
}

function parseSignature (data, cb) {
  if (data && data.userData && data.userData.signature) {
    data.userData.signature = magicBlock.parse(data.userData.signature);
  }
  cb(null, data);
}

// Begin Iframely
let htmlRegex= /(<a.*?>)(\S*?)(<\/a>)/g;
let keepString='<<hackIframely>>';
let keepStringRegex= new RegExp( keepString, 'g');

function afterIframelyRaw (data, cb) {
  if (data && typeof data === 'string') {
    if( hackIframely )data = hackIframelyAfter( data );
  }
  cb(null, data);
}

function afterIframelypost (data, cb) {
  if (data && data.postData && data.postData.content) {
    if( hackIframely ) data.postData.content = hackIframelyAfter(data.postData.content);
  }
  cb(null, data);
}



function hackIframelyBefore( data ){
  return data.replace( htmlRegex, function( match, $1,$2,$3 ){
    return $1+$2+keepString+$3;
  });
}
function hackIframelyAfter( data ){
  return data.replace(keepStringRegex,'');
}
// END Iframely
