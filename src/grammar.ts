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
    {"name": "placeholder", "symbols": ["ident"], "postprocess": 
        d => ({
          type: 'placeholder',
          name: d[0],
          functionCall: { type: 'functionCall', name: '_', args: [] }
        })
        },
    {"name": "placeholder", "symbols": ["ident", {"literal":":"}, "function_call"], "postprocess": 
        d => ({
          type: 'placeholder',
          name: d[0],
          functionCall: d[2]
        })
        },
    {"name": "function_call", "symbols": ["ident"], "postprocess": 
        d => ({
          type: 'functionCall',
          name: d[0],
          args: []
        })
        },
    {"name": "function_call", "symbols": ["ident", {"literal":"("}, "_", "expression_list", "_", {"literal":")"}], "postprocess": 
        d => ({
          type: 'functionCall',
          name: d[0],
          args: d[3]
        })
        },
    {"name": "expression_list", "symbols": ["expression"]},
    {"name": "expression_list", "symbols": ["expression", "_", {"literal":","}, "_", "expression_list"], "postprocess": d => [d[0]].concat(d[4])},
    {"name": "expression", "symbols": ["placeholder"], "postprocess": id},
    {"name": "ident$ebnf$1", "symbols": []},
    {"name": "ident$ebnf$1", "symbols": ["ident$ebnf$1", /[a-zA-Z0-9_]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ident", "symbols": ["_", /[a-zA-Z_]/, "ident$ebnf$1", "_"], "postprocess": d => d[1] + d[2].join("").trim()}
  ],
  ParserStart: "placeholder",
};

export default grammar;
