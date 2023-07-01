@preprocessor typescript
@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace

placeholder -> ident {%
  d => ({
    type: 'placeholder',
    name: d[0],
    functionCall: { type: 'functionCall', name: '_', args: [] }
  })
%}

placeholder -> ident ":" function_call {%
  d => ({
    type: 'placeholder',
    name: d[0],
    functionCall: d[2]
  })
%}

function_call -> ident {%
  d => ({
    type: 'functionCall',
    name: d[0],
    args: []
  })
%}

function_call -> ident "(" _ expression_list _ ")" {%
  d => ({
    type: 'functionCall',
    name: d[0],
    args: d[3]
  })
%}

expression_list -> expression
  | expression _ "," _ expression_list {% d => [d[0]].concat(d[4]) %}

expression -> placeholder {% id %}

ident -> _ [a-zA-Z_] [a-zA-Z0-9_]:* _ {% d => d[1] + d[2].join("").trim() %}
