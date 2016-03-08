'use strict'

/*======================== Exports  ========================*/
exports.isArray = isArray;
exports.isString = isString;
exports.isObject = isObject;

exports.isStr = isString;
exports.isObj = isObject;

exports.arrayLength = arrayLength;
exports.stringLength = stringLength;
exports.objectLength = objectLength;

exports.arrayfy = arrayfy;


function isArray ( v ){ return Array.isArray( v ); }
function isString( v ){ return typeof v === 'string'; }
function isObject( v ){ return typeof v === 'object'; }

function arrayfy( v ){ return isArray( v ) ? v : [v]; }
function arrayLength( v ){ return isArray(v)? v.length : 0; }
function stringLength( v ){ return isString(v)? v.length : 0; }
function objectLength( v ){ return isObject(v)? Object.keys(v).length : 0; }

