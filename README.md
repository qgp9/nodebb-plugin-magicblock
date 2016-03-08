# NodeBB MagicBlock plugin

NodeBB Plugin for macros, format, embeding.

* Discussion and examples at https://community.nodebb.org/topic/8098/some-ideas-and-on-going-development-of-new-plugin-called-magicblock
  * syntex, strategy are not yet concret.

## Usage

`{{.class1.class2#color1#color2 BODY }}` 

## Installation
```
npm install nodebb-plugin-magicblock
```

## Configuratoin

### Example
```
attrStrAllowClass: false
attrStrAllowColon: true
attrStrArrowTwoColon: false
macros:
  ALERT(1): '<div class="alert alert-<<1>>"><<BODY>></div>'
  ALERT(0): '<div class="alert alert-warning"><<BODY>></div>'
  PANEL(1): '<div class="panel panel-<<1>>"><div class="panel-body"><<BODY>></div></div>'
  PANEL(2): '<div class="panel panel-<<1>>"><div class="panel-heading"><<2>></div><div class="panel-body"><<BODY>></div></div>'
magicTagA:
  - [ '.*(jpg|png|gif|svg)$' , true , '<img src="<<URL>>">' ]
  - - '^(?:http:)?\\/\\/imgur.com/a/(w+)'
    - true
    - '<blockquote class="imgur-embed-pub" lang="en" data-id="a/<<1>>"><a href="<<URL>>">View post on imgur.com</a></blockquote><script async src=s.imgur.com/min/embed.js" charset="utf-8"></script>'
magicTagADefaultClass: [ iframely ]
```

## Acknowledge
* This plugin is based on [nodebb-mega-colors](https://github.com/MegaGM/nodebb-plugin-mega-colors)
