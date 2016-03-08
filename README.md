# NodeBB MagicBlock plugin

NodeBB Plugin for macros, format, embeding.

* Discussion and examples at [NodeBB Forum](https://community.nodebb.org/topic/8098/some-ideas-and-on-going-development-of-new-plugin-called-magicblock)

## Usage

### AttrString
`{{.class1.class2#color1#color2 BODY }}` 
* When a block begin with AttrString( begin with `.` or `#` and before a first white space )
#### Coloring
* A first color is for forground , a second is for backgoround color.
* Also rgb codes are possible. ( #eee or #e1e1e1 )
```
{{#red This is red letters}}
{{#red#green This is red letters on green background}}
```
### Class
```
{{.class1 [link](http://example.com)}}` will become `<a href="http://example.com" class="class1">link</a>
```
### Wraping with `<span>` or `<div>`
* `<div>` : If an AttrString is ended with double colons (`::`), followed text will be wraped by `<div>`
* `<span>` : If an AttrString is ended with a colon (`:`), followed text will be wraped by `<span>`
```
{{.cls1#red:: Any text or link}} will become <div class="cls" style="color:red;">Any text or link</div>
{{.cls1#red: Any text or link}} will become <span class="cls" style="color:red;">Any text or link</span>
```
* Implicit way : If no colon(s) end of an AttrString
  * If begins of BODY is any html tag, MagicBlock insert classes and colors into it
    * NOTE : MagicBlock knows nothing of Markdown, but just manage htmls which are already converted by MarkdownIt.
    * With `{{ [link](url) }}`, what actually MagicBlock will see is `{{ <a href="url">link</a> }}`
    * With `{{ http://a.com  }}`, what actually MagicBlock will see is `{{ <a href="http://a.com">a.com</a>}}`
  * If begins of BODY is not a html tag, MagicBlock will wrap BODY with `<span>` 
```
{{.cls1#red:: Any text or link}} will become <div class="cls" style="color:red;">Any text or link</div>
{{.cls1#red: Any text or link}} will become <span class="cls" style="color:red;">Any text or link</span>
```

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
