@preprocessor typescript
@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace
@builtin "string.ne"
@builtin "number.ne"

placeholder -> _ variable _ {% d => ({
  type: 'placeholder',
  value: d[1],
}) %}

placeholder -> _ generator _ {% d => ({
  type: 'placeholder',
  value: d[1],
}) %}

placeholder -> _ function_call _ {% d => ({
  type: 'placeholder',
  value: d[1],
}) %}

generator -> "*" {%
  d => ({
    type: 'generator',
  })
%}

generator -> "*" ident {%
  d => ({
    type: 'generator',
    identifier: d[1],
  })
%}

variable -> ident {%
  d => ({
    type: 'variable',
    identifier: d[0],
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

variable -> ident _ ":" _ function_call {%
  d => ({
    type: 'variable',
    identifier: d[0],
    functionCall: d[4],
  })
%}

function_call -> ident _ "(" ")" {%
  d => ({
    type: 'functionCall',
    identifier: d[0],
    args: [],
  })
%}

function_call -> ident _ "(" _ expression_list _ ")" {%
  d => ({
    type: 'functionCall',
    identifier: d[0],
    args: d[4],
  })
%}

expression_list -> expression
  | expression _ "," _ expression_list {% d => [d[0]].concat(d[4]) %}

expression -> variable {% id %}
  | function_call {% id %}
  | string_literal {% id %}
  | number_literal {% id %}

ident -> [a-zA-Z_] [a-zA-Z0-9_]:* {%
  (d, offset) => ({
    type: 'identifier',
    name: d[0] + d[1].join(""),
    offset,
  })
%}

string_literal -> dqstring {%
  (d, offset) => ({
    type: 'stringLiteral',
    value: d[0],
    offset,
  })
%}

string_literal -> sqstring {%
  (d, offset) => ({
    type: 'stringLiteral',
    value: d[0],
    offset,
  })
%}

number_literal -> decimal {%
  (d, offset) => ({
    type: 'numberLiteral',
    value: d[0],
    offset,
  })
%}
