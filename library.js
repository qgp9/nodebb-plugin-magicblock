  'use strict';

  //let	meta = module.parent.require('./meta');
  let controllers = require('./lib/controllers');

  let codeRegex = /(?:<pre>.*?<\/pre>|<code>.*?<\/code>)/g,
  magicBlockRegex = /\{\{(.*?)\}\}/;

  //===========================================
  //  MagicBlock.macros
  //===========================================
  let MagicBlock = {
    options: { // not implemented yet TODO
      blockOpen: '{{', //}}{{ ( dummy )
      blockClose: '}}', //
      blockOpenRegx: '\{\{',
      blockCloseRegx: '\}\}',
      allowedAttribute: {
        '*': { 'class':['*'], 'style':['*']  },
        'a': { 'role':['button'] }
      },
      dummy: 1
    },
    init: function(params, callback){
      let router = params.router,
      hostMiddleware = params.middleware,
      hostControllers = params.controllers;

      // We create two routes for every view. One API call, and the actual route itself.
      // Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

      router.get('/admin/plugins/magicblock', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
      router.get('/api/admin/plugins/magicblock', controllers.renderAdminPage);

      callback();

    },

    addAdminNavigation: function(header, callback) {
      header.plugins.push({
        route: '/plugins/magicblock',
        icon: 'fa-tint',
        name: 'MagicBlock'
      });

      callback(null, header);
    },
    //===========================================
    //  MagicBlock.macros
    //===========================================
    macrosTemplate: {
      BUTTON: {
        4: '<a href="__BODY__" class="btn btn-<1> btn-<2>" role="button"><3></a>',
        3: '{{BUTTON(<1>,xs,<2>,<3>)}}',
      },
      //{{BUTTON(info,lg,link) http://example.com)}}
      PANEL:  { 
        1: '<div class="panel panel-<1>"> <div class="panel-heading"><2></div><div class="panel-body">__BODY__</div></div>',
      },
      //{{PANEL(info, title) contents}}
      dummy: 0
    },
    macros: {

    },
    //===========================================
    // MagicBlock.parseAttrs 
    //===========================================
    parseAttrs: function(attrRaw){ 
      let classAttr = [];
      let colorAttr = [];
      attrRaw.replace( /([\.#])([\w\-]+)/g, function( match, $1,$2 ){
        if( $1 == '.' ){
          classAttr.push( $2 );
        }else if( $1 == '#' ){
          if( $2.match(/\D+/) ){
            colorAttr.push( $2 );
          }else{
            colorAttr.push( $1+$2 );
          }
        }
      });
      if( colorAttr[0] ) { colorAttr[0] = 'color:'+colorAttr[0]+';'; }
      if( colorAttr[1] ) { colorAttr[1] = 'background-color:'+colorAttr[1]+';'; }
      return { 'classAttr' : classAttr, 'colorAttr' : colorAttr }; 
    },
    //===========================================
    // MagicBlock.addAttrs 
    //===========================================
    addAttrs: function( contents, attrs ){ 
      let matched;
      // ADD Class
      if( attrs.classAttr && attrs.classAttr.length > 0 ){
        if( matched = contents.match( /(^<[^>]+class=".*?)(".*)/ )){
          contents = matched[1] + ' ' + attrs.classAttr.join(' ') + matched[2];
        }else if( matched = contents.match( /(^<.*?)(>.*)/ )){
          contents = matched[1] + ' class="'+attrs.classAttr.join(' ') + '"' + matched[2];
        }
      }
      // ADD Color
      if( attrs.colorAttr && attrs.colorAttr.length > 0 ){
        if( matched = contents.match( /(^<[^>]+style=".*?)(".*)/ )){
          contents = matched[1] + ' ' + attrs.colorAttr.join() + matched[2];
        }else if(  matched = contents.match( /(^<.*?)(>.*)/ )){
          contents = matched[1] + ' style="'+attrs.colorAttr.join('') + '"' + matched[2];
        }
      }
      // TODO ADD styles, approved attrs
      return contents; 
    },
    //===========================================
    // MagicBlock.addAttrs 
    //===========================================
    magic: function( data ){
      // if it's link ( for only first <a> tag )
      let matched;
      if( matched = data.match(/^<a[^>]+href="(.*?)".*?>(.*?)<\/a>/ ) ){
        let url = matched[1];
        let body = matched[2];
        // Images, TODO chance to give a format( border, wraper... )?
        if( matched = url.match(/.*?\/\/imgur.com\/a\/(\w+)/) ){
          let imgur_id=matched[1];
          return '<blockquote class="imgur-embed-pub" lang="en" data-id="a/'+imgur_id+'"><a href="//imgur.com/a/'+imgur_id+'">View post on imgur.com</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>'
        }
        if( matched = url.match(/([^\/\s]+(?:jpg|svg|png|gif))$/i) ){
          let filename=matched[1] || '';
          body = body.replace(/["']/g,''); // Strip quote from body/title
            return '<img src="'+url+'" alter="'+filename+'" title="'+body+'">';
        }
        // use iframely. TODO custom for well-known format?
        return this.addAttrs( data, { 'classAttr': ['iframely'] } );
      }
      return data;
    },

    //===========================================
    // MagicBlock.addAttrs - Deal with one magic block
    //===========================================
    parseBlock: function ( data ){ 
      if( !data ) return '';
      // if there is macroname ( no space between begin of block and name
      let macroName = data.match(/^\w+/);
      if( macroName && this.macros[macroName[0]] ){

        //TODO check existance of the macros and if it's string or function
        return this.macros[macroName[0]](data);
      }
      // If begin with attrs string ( .class color ), NO preceding space
      let matched = data.match( /^([\.#]\S+)(\s+)(.*)/ );
      if( matched ){ 
        let attrs = this.parseAttrs( matched[1]);
        if( matched.length < 4 ) matched.push(['','']);
        if( matched[3] && matched[3].match( /^</ ) && !matched[1].match(/:$/)){
          return this.addAttrs( matched[3], attrs );
        }else if ( matched[1].match(/::$/)){
          return this.addAttrs( '<div>'+matched[3]+'</div>', attrs );
        }else {
          return this.addAttrs( '<span>'+matched[3]+'</span>', attrs );
        }
      }
      // If no MacroName, no attrs string, then just magic
      return this.magic( data.trim() );
    },


    //===========================================
    // parser - parse whole contents and extract nested block
    //          Inner block first by stack method.
    //===========================================
    parserContents: function(data) {
      // keep <code>...</code>
      let codeTags = [];
      data = data.replace(codeRegex, function (match) {
        codeTags.push(match);
        return '___CODE___';
      });

      // Extract blocks and call MagicBlock.parseBlock
      let matchList = [];
      let result = '';
      let depth = 0;
      let flag = -1; // 0=open, 1=close 
      let match1 = data.split( /(\{\{|\}\})/ );
      let i=0;
      for( i=0;i<match1.length;i++ ){
        let s = match1 [i] ;
        if( s == '{{' ){
          flag = 0;
        }else if( s == '}}' ){
          flag = 1;
        }else {
          if( flag == 0 ){
            depth++;
            matchList.push( s );
          }else{
            if( flag == 1 ) { depth--; }
            let tmp_result = '';
            if( depth < 0 ){
              result += s;
            }else if( depth == 0 ){
              result += MagicBlock.parseBlock( matchList.pop() ) + s;
            }else{ // depth > 0
              tmp_result = MagicBlock.parseBlock( matchList.pop() );
              matchList[matchList.length-1] += tmp_result + s;
            }
          }
        }
      }
      data = result;
      // Restore code block
      data = data.replace(/___CODE___/g, function (match) {
        return codeTags.shift();
      });
      return data;
    },
    //===========================================
    //  MagicBlock.parse : Method for filter hook
    //===========================================
    parse: function (data, callback) {
      if (data && 'string' === typeof data) {
        // filter:parse.raw
        data = MagicBlock.parserContents(data);
      } else if (data.postData && data.postData.content && data.postData.content.match(magicBlockRegex)) {
        // filter:parse.post
        data.postData.content = MagicBlock.parserContents(data.postData.content);
      } else if (data.userData && data.userData.signature && data.userData.signature.match(magicBlockRegex)) {
        // filter:parse.signature
        data.userData.signature = MagicBlock.parserContents(data.userData.signature);
      }
      callback(null, data);
    },
    dummy: 'dummy'
  };


  //===========================================
  //  Export MagicBlock
  //===========================================
  module.exports = MagicBlock;

