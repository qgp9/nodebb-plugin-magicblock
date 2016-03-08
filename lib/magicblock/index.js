'use strict'

let options = require( './options' );

let codeRegex = /(?:<pre>.*?<\/pre>|<code>.*?<\/code>)/g,
    magicBlockRegex = /\{\{(.*?)\}\}/;
let codeString = '<<code>>';
let codeStringRegex = new RegExp( codeString, 'g' );


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

  if( magicTagA && Array.isArray(magicTagA) ){
    magicTagARegex = new Array( magicTagA.length );
    for( let i=0;i<magicTagA.length;i++ ){
      if( Array.isArray( magicTagA[i] ) 
          && magicTagA[i].length === 3
          && typeof magicTagA[i][0] === 'string'
        ){
        magicTagARegex[i] = new RegExp( magicTagA[i][0], magicTagA[i][1]===true?'':'i' );
        doMagicTagA = true;
        console.log( magicTagA[i][0] );
      }
    }
  }

  function parseAttrs (attrRaw) {
    let classAttr = []
    let colorAttr = []
    attrRaw.replace(/([\.#])([\w\-]+)/g, function (match, $1, $2) {
      if ($1 == '.') {
        if( opts.attrStrAllowClass) classAttr.push($2)
      }else if ($1 == '#') {
        if ($2.match(/\D+/)) {
          if( opts.attrStrAllowColor) colorAttr.push($2)
        } else {
          colorAttr.push($1 + $2)
        }
      }
    })
    if (colorAttr[0]) { colorAttr[0] = 'color:' + colorAttr[0] + ';'; }
    if (colorAttr[1]) { colorAttr[1] = 'background-color:' + colorAttr[1] + ';'; }
    return { 'classAttr': classAttr, 'colorAttr': colorAttr }
  }


  function addAttrs (contents, attrs) {
    let matched
      // ADD Class
      if (attrs.classAttr && attrs.classAttr.length > 0) {
        if (matched = contents.match(/(^<[^>]+class=".*?)(".*)/)) {
          contents = matched[1] + ' ' + attrs.classAttr.join(' ') + matched[2]
        }else if (matched = contents.match(/(^<.*?)(>.*)/)) {
          contents = matched[1] + ' class="' + attrs.classAttr.join(' ') + '"' + matched[2]
        }
      }
    // ADD Color
    if (attrs.colorAttr && attrs.colorAttr.length > 0) {
      if (matched = contents.match(/(^<[^>]+style=".*?)(".*)/)) {
        contents = matched[1] + ' ' + attrs.colorAttr.join() + matched[2]
      }else if (matched = contents.match(/(^<.*?)(>.*)/)) {
        contents = matched[1] + ' style="' + attrs.colorAttr.join('') + '"' + matched[2]
      }
    }
    // TODO ADD styles, approved attrs
    return contents
  }

  function magic (data) {
    // if it's link ( for only first <a> tag )
    let matched;
    let urlMatched;
    if (matched = data.match(/^<a[^>]+href="(.*?)".*?>(.*?)<\/a>/)) {
      let url = matched[1]
      let body = matched[2]
      if( doMagicTagA ){
        for( let i=0;i< magicTagARegex.length;i++ ){
          console.log ( magicTagARegex[i] );
          if( urlMatched = url.match( magicTagARegex[i] ) ){
            data = magicTagA[i][2];
            data.replace( '<<URL>>' , url );
            for( let j=1;j<urlMatched.length;j++ ){
              data.replace( '<<'+j+'>>', urlMatched[j] );
            }
            return data;
          }
        }
      }
      // use iframely. TODO custom for well-known format?
      return addAttrs(data, { 'classAttr': ['iframely'] })
    }
    return data
  }


  function parseBlock(data) {
    if (!data) return '';
    let innerBlocks = data.split('}{'); 

      if( data.match( /^(\w+)(?:\((.*?)\))\s/ ) ){
      }
      // If begin with attrs string ( .class color ), NO preceding space
      let matched = data.match(/^([\.#]\S+)(\s+)(.*)/)
        if (matched) {
          let attrs = parseAttrs(matched[1]);
          if (matched.length < 4) matched.push(['', ''])
            // Single Colon
            if( opts.attrStrAllowColon && matched[1].match(/[^:]:$/) ){
              return addAttrs('<span>' + matched[3] + '</span>', attrs)
            } // Double Colon
            else if (opts.attrStrAllowDoubleColon && matched[1].match(/::$/)) {
              return addAttrs('<div>' + matched[3] + '</div>', attrs)
            } // Inner tag 
            else if (matched[3] && matched[3].match(/^</)) {
              return addAttrs(matched[3], attrs)
            } // SPAN
            else {
              return addAttrs('<span>' + matched[3] + '</span>', attrs)
            }
        }
      // If no MacroName, no attrs string, then just magic
      return magic(data.trim())
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

function magicBlockWraper( opts ){
  let mb = new MagicBlockEngine( opts );

  this.parse = function( data ){
    return mb.parserContents( data );
  }
}
