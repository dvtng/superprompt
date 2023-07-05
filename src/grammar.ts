// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "placeholder", "symbols": ["_", "ident", "_"], "postprocess": 
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
        },
    {"name": "placeholder", "symbols": ["_", "ident", "_", {"literal":":"}, "function_call"], "postprocess": 
        d => ({
          type: 'placeholder',
          identifier: d[1],
          functionCall: d[4],
        })
        },
    {"name": "function_call", "symbols": ["_", "ident", "_"], "postprocess": 
        d => ({
          type: 'functionCall',
          identifier: d[1],
          args: [],
        })
        },
    {"name": "function_call", "symbols": ["_", "ident", "_", {"literal":"("}, "_", "expression_list", "_", {"literal":")"}], "postprocess": 
        d => ({
          type: 'functionCall',
          identifier: d[1],
          args: d[5],
        })
        },
    {"name": "expression_list", "symbols": ["expression"]},
    {"name": "expression_list", "symbols": ["expression", {"literal":","}, "expression_list"], "postprocess": d => [d[0]].concat(d[2])},
    {"name": "expression", "symbols": ["placeholder"], "postprocess": id},
    {"name": "ident$ebnf$1", "symbols": []},
    {"name": "ident$ebnf$1", "symbols": ["ident$ebnf$1", /[a-zA-Z0-9_]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ident", "symbols": [/[a-zA-Z_]/, "ident$ebnf$1"], "postprocess": 
        (d, offset) => ({
          type: 'identifier',
          name: d[0] + d[1].join(""),
          offset,
        })
        }
  ],
  ParserStart: "placeholder",
};

export default grammar;
