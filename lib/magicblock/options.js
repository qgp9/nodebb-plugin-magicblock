'use strict'

var extend = require('util')._extend;
let defaults = require('./defaults');

/*======================== Exports  ========================*/
exports.build = buildOptions;
exports.deepCopy = deepCopy;

/*======================== function  ========================*/
function deepCopy(obj) {
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    var out = [], i = 0, len = obj.length;
    for ( ; i < len; i++ ) {
      out[i] = deepCopy(obj[i]);
    }
    return out;
  }
  if (typeof obj === 'object') {
    var out = {}, i;
    for ( i in obj ) {
      out[i] = deepCopy(obj[i]);
    }
    return out;
  }
  return obj;
}

function buildOptions( _opts, _defaults ){
  let opts = {};
  if( !_defaults ) _defaults = defaults.value;
  if( !_opts || typeof opts.fullOptions === 'string' ) return deepCopy(_defaults);
  for( let field in _defaults ){
    let defa = _defaults[field]; 
    if( _opts.hasOwnProperty(field) ){
      let opt  = _opts[field];
      if( opt === false || typeof opt === typeof defa ){
        opts[field] = deepCopy( opt );
      }
    }else{
      opts[field] = deepCopy( defa );
    }
  }
  return opts;
}
