@preprocessor typescript
@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace

placeholder -> _ ident _ {%
  d => ({
    type: 'placeholder',
    identifier: d[1],
    functionCall: {
      type: 'functionCall',
      identifier: {
        type: 'identifier',
        name: '_',
        offset: -1,
      },
      args: []
    },
  })
%}

placeholder -> _ ident _ ":" function_call {%
  d => ({
    type: 'placeholder',
    identifier: d[1],
    functionCall: d[4],
  })
%}

function_call -> _ ident _ {%
  d => ({
    type: 'functionCall',
    identifier: d[1],
    args: [],
  })
%}

function_call -> _ ident _ "(" _ expression_list _ ")" {%
  d => ({
    type: 'functionCall',
    identifier: d[1],
    args: d[5],
  })
%}

expression_list -> expression
  | expression "," expression_list {% d => [d[0]].concat(d[2]) %}

expression -> placeholder {% id %}

ident -> [a-zA-Z_] [a-zA-Z0-9_]:* {%
  (d, offset) => ({
    type: 'identifier',
    name: d[0] + d[1].join(""),
    offset,
  })
%}
