'use strict'

let u = require( './utils'   );
let options = require( './options' );

let arrayfy = u.arrayfy

let codeRegex = /(?:<pre>.*?<\/pre>|<code>.*?<\/code>)/g,
    magicBlockRegex = /\{\{(.*?)\}\}/;
let codeString = '<<code>>';
let codeStringRegex = new RegExp( codeString, 'g' );
let blockOpener       = '{{'; //}}
let blockCloser       = '}}';
let blockOpenerRegStr = '\{\{';
let blockCloserRegStr = '\}\}';
let blockInner        = '}{'; //}
let blockInnerRegStr  = '\}\{';


/*======================== Exports  ========================*/
module.exports = magicBlockWraper;

/*======================== function  ========================*/

// FIXME: Split utilities/methods to files
function MagicBlockEngine( _opts ) {
  // Private
  let bc   = {};                      // berifcase
  let opts = options.build( _opts );  // options
  let magicTagA = opts.magicTagA;
  let magicTagARegex;
  let doMagicTagA;
  let numberOfMacros = u.objectLength( opts.macros );

  // Public
  let self = this;
  self.options;     // FIXME: Needed?

  // Public Method  // FIXME: really?
  let methods = MagicBlockEngine.prototype;
  methods.parseAttrs     = parseAttrs;
  methods.addAttrs       = addAttrs;
  methods.magic          = magic;
  methods.parseBlock     = parseBlock;
  methods.parserContents = parserContents;


  if( opts.DEBUG ) console.log( opts );

  // build regex for magicTag
  magicTagARegex = buildMagicRegex( opts.magicTagA );


  /*=================== function  ===================*/
  function parseAttrs (attrRaw) {
    let classAttr = []
    let colorAttr = []
    attrRaw.replace(/([\.#])([\w\-]+)/g, function (match, $1, $2) {
      if ($1 == '.') {
        if( opts.attrStrAllowClass ) classAttr.push($2)
      }else if ($1 == '#') {
        if ($2.match(/^[\da-fA-F]+$/)) {
          if( opts.attrStrAllowColor ) colorAttr.push($1+$2)
        } else {
          if( opts.attrStrAllowColor ) colorAttr.push($2)
        }
      }
    });
    if (colorAttr[0]) { colorAttr[0] = 'color:' + colorAttr[0] + ';'; }
    if (colorAttr[1]) { colorAttr[1] = 'background-color:' + colorAttr[1] + ';'; }
    let result = {};
    result.classAttr = classAttr;
    result.colorAttr = colorAttr;
    result.forceSPAN =  ( opts.attrStrAllowColon    && attrRaw.match(/[^:]:$/) )?true:false;
    result.forceDIV  =  ( opts.attrStrAllowTwoColon && attrRaw.match(/::$/   ) )?true:false;

    return result; 
  }

  function addAttrs (contents, attrs) {
    if( !contents || !attrs ) return contents;
    let matched;
    // ADD Class
    if ( u.arrayLength( attrs.classAttr ) > 0) {
      if (matched = contents.match(/(^<[^>]+class=".*?)(".*)/)) {
        contents = matched[1] + ' ' + attrs.classAttr.join(' ') + matched[2];
      }else if (matched = contents.match(/(^<.*?)(>.*)/)) {
        contents = matched[1] + ' class="' + attrs.classAttr.join(' ') + '"' + matched[2];
      }
    }
    // ADD Color
    if ( u.arrayLength( attrs.colorAttr ) > 0) {
      if (matched = contents.match(/(^<[^>]+style=".*?)(".*)/)) {
        contents = matched[1] + ' ' + attrs.colorAttr.join() + matched[2];
      }else if (matched = contents.match(/(^<.*?)(>.*)/)) {
        contents = matched[1] + ' style="' + attrs.colorAttr.join('') + '"' + matched[2];
      }
    }
    // TODO ADD styles, approved attrs
    return contents;
  }

  function magic (data) {
    if( !data ) return data;
    let matched; 
    let urlMatched;
    // if it's link ( for only first <a> tag )
    if (matched = data.match(/^<a[^>]+href="(.*?)".*?>(.*?)<\/a>/)) {
      let url = matched[1];
      let body = matched[2];
      if( magicTagARegex ){
        for( let i=0;i< u.arrayLength(magicTagARegex);i++ ){
          if( urlMatched = url.match( magicTagARegex[i] ) ){
            data = magicTagA[i][2];
            data = data.replace( '<<URL>>' , url );
            data = data.replace( /<<(\d+)>>/g, function( m,$1 ){ return urlMatched[$1]||'' });
            //            for( let j=1;j<urlMatched.length;j++ ){
            //             data = data.replace( '<<'+j+'>>', urlMatched[j] );
            //         }
            return data;
          }
        }
      }

      // default is iframely
      if( opts.magicTagADefaultClass ){
        return addAttrs(data, { 'classAttr': arrayfy( opts.magicTagADefaultClass  ) });
      }
    }
    return data
  }

  function parseBlock(data) {
    if (!data) return '';
    let head, body, matched;
    // MAGIC
    if( data.match( /^\s*</ )){ return magic(data.trim())}
    // ATTR STRING
    if( matched = data.match( /^([\.#]\S+)(?:\s*|$)(.*)/ )){
      head   = matched[1]; 
      body = matched[2] || '';
      let attrs = parseAttrs(head);
      if( attrs.forceSPAN ){
        return addAttrs('<span>' + body + '</span>', attrs);
      } 
      if ( attrs.forceDIV ){
        return addAttrs('<div>' + body + '</div>', attrs);
      } 
      if ( body.match(/^</)) {
        return addAttrs( body , attrs);
      } 
      return addAttrs('<span>' + body + '</span>', attrs);
    }
    // MACROS
    if( numberOfMacros && (matched = data.match(/\s*(\w+)(?:\((.*?)\))?(?::|\s*$)(\S*)(.+)?/)) ){
      let head = matched[1];
      let args = matched[2] ;
      let arg2 = matched[3];
      let body = matched[4];

      let argsName = '';
      let argsArray = [];

      if ( args && arg2 ){
        return 'ERROR: You CANNOT USE both of args and arg in form of MACRONAME(ARGS):ARG'; 
      }

      // check args in ( .. )
      if( args ){
        args = args.trim();
        if( args.length > 0 ){
          argsArray = args.split(',');
        }
      }else if( arg2 ){
        argsArray.push ( arg2 )
      }
      argsName = '('+argsArray.length+')';
      let macroName = head+argsName;
      if( opts.macros.hasOwnProperty( macroName ) ) {
        let macro = opts.macros[macroName];
        macro = macro.replace(/<<(\d+)>>/g, function(m,$1){
          return argsArray[$1-1] || '';
        });
        macro = macro.replace( '<<BODY>>', body );
        return macro;
      }
    }
    // MAGIC
    return magic(data.trim());
  }

  function parserContents (data) {
    // keep <code>...</code>
    if (! data) return data
      let codeTags = []
      data = data.replace(codeRegex, function (match) {
        codeTags.push(match)
          return codeString;
      })

      // Extract blocks and call MagicBlockEngine.parseBlock
      let matchList = []
      let result = ''
      let depth = 0
      let flag = -1; // 0=open, 1=close 
      let match1 = data.split(/(\{\{|\}\})/);
      let i = 0;
      for (i = 0;i < match1.length;i++) {
        let s = match1[i]
        if (s == '{{') {
          flag = 0
        }else if (s == '}}') {
          flag = 1
        } else {
          if (flag == 0) {
            depth++
              matchList.push(s)
          } else {
            if (flag == 1) { depth--; }
            let tmp_result = ''
              if (depth < 0) {
                result += s
              }else if (depth == 0) {
                result += parseBlock(matchList.pop()) + s
              } else { // depth > 0
                tmp_result = parseBlock(matchList.pop())
                  matchList[matchList.length - 1] += tmp_result + s
              }
          }
        }
      }
      data = result
        // Restore code block
        data = data.replace( codeStringRegex, function (match) {
          return codeTags.shift()
        })
      return data
  }
}

function buildMagicRegex( conf ){
  if( ! u.isArray( conf ) ){ return false; }
  let reg  = [];
  for( let i=0;i<conf.length;i++ ){
    if( u.arrayLength(conf[i] ) === 3 && u.isString( conf[i][0] ) ){
      reg[i]= new RegExp( conf[i][0], conf[i][1]===true?'':'i' );
    }
  }
  if( reg.length == 0 ) reg = false;
  return reg;
}



function magicBlockWraper( opts ){
  let mb = new MagicBlockEngine( opts );

  this.parse = function( data ){
    return mb.parserContents( data );
  }
}
