'use strict'
/*======================== Exports  ========================*/
exports.value = {
  globalClass: [ 'magicblock' ],  // if no globalClassa then just [] or false
  attrStrAllowClass:        false,
  attrStrAllowColor:        false,
  attrStrAllowColon:        true,
  attrStrArrowTwoColon:     false,
  macrosNameCaseSensitive : false,
  macros:{ // 
    'ALERT(1,1)': '<div class="alert alert-<<1>>"><<BODY>></div>',
    'ALERT(0,1)': '{{ALERT(warning) <<BODY>>}}',
    'PANEL(1,1)': '<div class="panel panel-<<1>>"><div class="panel-body"><<BODY>></div></div>',
    'PANEL(1,2)': '<div class="panel panel-<<1>>"><div class="panel-heading"><<BODY1>></div><div class="panel-body"><<BODY2>></div></div>',
    'PANEL(0,1)': '{{PANEL(info) <<BODY>>}}',
    'PANEL(0,2)': '{{PANEL(info)}{ <<BODY1>> }{ <<BODY2>> }}'
  },
  magicTagA: [
    // Images
    [ '.*(jpg|png|gif|svg)$' , true, '<img src="<<url>>">' ],
    // Imgur galery
    [ '^(?:http:)?\\/\\/imgur.com\/a\/(\w+)', true, '<blockquote class="imgur-embed-pub" lang="en" data-id="a/<<1>>"><a href="<<URL>>">View post on imgur.com</a></blockquote><script async src=s.imgur.com/min/embed.js" charset="utf-8"></script>' ]
  ],
  magicTagADefaultClass: [ 'iframely' ],
  magicTagADefaultAction: false,
  magicDefaultClass: [ 'iframely' ],
  magicDefaultAction:     false,
  DEBUG: false,
  DEBUG_LEVEL: 5
};
