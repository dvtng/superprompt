@preprocessor typescript
@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace

placeholder -> variable {% d => ({
  type: 'placeholder',
  value: d[0],
}) %}

placeholder -> generator {% d => ({
  type: 'placeholder',
  value: d[0],
}) %}

generator -> _ "*" _ {%
  d => ({
    type: 'generator',
  })
%}

generator -> _ "*" ident _ {%
  d => ({
    type: 'generator',
    identifier: d[2],
  })
%}

variable -> _ ident _ {%
  d => ({
    type: 'variable',
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

variable -> _ ident _ ":" function_call {%
  d => ({
    type: 'variable',
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

expression -> variable {% id %}

ident -> [a-zA-Z_] [a-zA-Z0-9_]:* {%
  (d, offset) => ({
    type: 'identifier',
    name: d[0] + d[1].join(""),
    offset,
  })
%}
