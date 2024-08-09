import * as monaco from 'monaco-editor'
import jsonataLocaleEnUs from './jsonata.locales.en-US';

/* Copied from Node-Red project:
https://github.com/node-red/node-red/blob/9d054543a765451a41b5959c1e5dba617097a93c/packages/node_modules/%40node-red/editor-client/src/js/ui/editors/code-editors/monaco.js
 */

function setupJSONata() {
    // Register the language 'jsonata'
    monaco.languages.register({ id: 'jsonata' });

    // Setup tokens for JSONata
    monaco.languages.setMonarchTokensProvider('jsonata',
        {
            // Set defaultToken to invalid to see what you do not tokenize yet
            defaultToken: 'invalid',
            tokenPostfix: '.js',
            keywords: ["function", "true", "true", "null", "Infinity", "NaN", "undefined"].concat(Object.keys(Object.keys(jsonataLocaleEnUs))),
            operatorsKeywords: ['and', 'or', 'in'],
            operators: [
                '<=', '>=', '!=', '==', '!=', '=>', '+', '-', '*', '/', '%',
                ':=', '~>', '?', ':', '..', '@', '#', '|', '^', '*', '**',
            ],
            // we include these common regular expressions
            symbols: /[=><!~?:&|+\-*\/\^%@#]+/,
            escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
            digits: /\d+(_+\d+)*/,
            octaldigits: /[0-7]+(_+[0-7]+)*/,
            binarydigits: /[0-1]+(_+[0-1]+)*/,
            hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

            regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
            regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

            // The main tokenizer
            tokenizer: {
                root: [
                    [/[{}]/, 'delimiter.bracket'],
                    { include: 'common' }
                ],

                common: [
                    // identifiers and keywords
                    [/([a-zA-Z][\w$]*)|([$][\w$]*)/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@operatorsKeywords': 'keyword',
                            '$2': 'variable', //when its not a key word but starts with $, use "tag" for colourisation
                            //'$2': 'tag', //when its not a key word but starts with $, use "tag" for colourisation
                            //'$2': 'constant', //alt colourisation
                            //'$2': 'attribute', //alt colourisation
                            //'$2': 'identifier.variable', //alt custom colourisation
                            '@default': 'identifier'
                        }
                    }],
                    [/[$][\w\$]*/, 'variable'],

                    // whitespace
                    { include: '@whitespace' },

                    // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
                    [/\/(?=([^\\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|\/|,|\)|\]|\}|$))/, { token: 'regexp', bracket: '@open', next: '@regexp' }],

                    // delimiters and operators
                    [/[()\[\]]/, '@brackets'],
                    [/[<>](?!@symbols)/, '@brackets'],
                    [/(@symbols)|(\.\.)/, {
                        cases: {
                            '@operators': 'operator',
                            '@default': ''
                        }
                    }],

                    // numbers
                    [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
                    [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
                    [/0[xX](@hexdigits)/, 'number.hex'],
                    [/0[oO]?(@octaldigits)/, 'number.octal'],
                    [/0[bB](@binarydigits)/, 'number.binary'],
                    [/(@digits)/, 'number'],

                    // delimiter: after number because of .\d floats
                    [/[?:;,.]/, 'delimiter'],

                    // strings
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
                    [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
                    [/"/, 'string', '@string_double'],
                    [/'/, 'string', '@string_single'],
                    [/`/, 'string', '@string_backtick'],
                ],

                whitespace: [
                    [/[ \t\r\n]+/, ''],
                    [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment'],
                ],

                comment: [
                    [/[^\/*]+/, 'comment'],
                    [/\*\//, 'comment', '@pop'],
                    [/[\/*]/, 'comment']
                ],

                jsdoc: [
                    [/[^\/*]+/, 'comment.doc'],
                    [/\*\//, 'comment.doc', '@pop'],
                    [/[\/*]/, 'comment.doc']
                ],

                // We match regular expression quite precisely
                regexp: [
                    [/(\{)(\d+(?:,\d*)?)(\})/, ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']],
                    [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]],
                    [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
                    [/[()]/, 'regexp.escape.control'],
                    [/@regexpctl/, 'regexp.escape.control'],
                    [/[^\\\/]/, 'regexp'],
                    [/@regexpesc/, 'regexp.escape'],
                    [/\\\./, 'regexp.invalid'],
                    [/(\/)([gimsuy]*)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']],
                ],

                regexrange: [
                    [/-/, 'regexp.escape.control'],
                    [/\^/, 'regexp.invalid'],
                    [/@regexpesc/, 'regexp.escape'],
                    [/[^\]]/, 'regexp'],
                    [/\]/, { token: 'regexp.escape.control', next: '@pop', bracket: '@close' }],
                ],

                string_double: [
                    [/[^\\"]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/"/, 'string', '@pop']
                ],

                string_single: [
                    [/[^\\']+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/'/, 'string', '@pop']
                ],

                string_backtick: [
                    [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
                    [/[^\\`$]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/`/, 'string', '@pop']
                ],

                bracketCounting: [
                    [/\{/, 'delimiter.bracket', '@bracketCounting'],
                    [/\}/, 'delimiter.bracket', '@pop'],
                    { include: 'common' }
                ],
            },
        }

    );

    // Setup JSONata language config
    monaco.languages.setLanguageConfiguration('jsonata', {
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: "'", close: "'", notIn: ['string', 'comment'] },
            { open: '"', close: '"', notIn: ['string'] }
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
            { open: '<', close: '>' }
        ],
        folding: {
            markers: {
                start: new RegExp('^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))'),
                end: new RegExp('^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))')
            }
        }
    });

    // Register a completion item provider for JSONata snippets
    monaco.languages.registerCompletionItemProvider('jsonata', {
        provideCompletionItems: function (model, position) {
            var _word = model.getWordUntilPosition(position);
            if (!_word) { return; }
            var startColumn = _word.startColumn;
            var word = _word.word;
            if (word[0] !== "$" && position.column > 1) { startColumn--; }
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: startColumn,
                endColumn: _word.endColumn
            };
            let jsonataSuggestions = Object.keys(jsonataLocaleEnUs).map((functionName: string) => {
                const args = jsonataLocaleEnUs[functionName].args;
                const desc = jsonataLocaleEnUs[functionName].desc;
                const title = `${functionName}(${args})`;
                const insertText = `\\${functionName}(${args.replaceAll("[", "").replaceAll("]", "")})`;
                const documentation = { value: '`' + title + '`\n\n' + desc };
                return {
                    label: functionName,
                    kind: monaco.languages.CompletionItemKind.Function,
                    documentation: documentation,
                    insertText: insertText,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: range
                }
            });
            return { suggestions: jsonataSuggestions };
        }
    });

    // Register a hover provider for JSONata functions
    monaco.languages.registerHoverProvider('jsonata', {
        provideHover: function (model, position) {
            var w = model.getWordAtPosition(position);
            var f = w && w.word;
            if (!f) { return; }
            if (f[0] !== "$" && position.column > 1) {
                f = "$" + f;
            } else {
                return;
            }
            if (!jsonataLocaleEnUs[f]) { return; }
            let args = jsonataLocaleEnUs[f].args;
            let desc = jsonataLocaleEnUs[f].desc;
            if (!args) { return; }
            var title = f + "(" + args + ")";

            /** @type {monaco.Range} */
            var r = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column + (w?.word?.length ?? 0));
            return {
                range: r,
                contents: [
                    { value: '**`' + title + '`**' },
                    { value: desc },
                ]
            }
        }
    })
}

function setupCsv(delimiter: string) {
    const name = `csv-${delimiter}`;
    monaco.languages.register({ id: name });

    monaco.languages.setMonarchTokensProvider(name, {
        tokenizer: {
            root: [
                [new RegExp(`[^${delimiter}]+`), 'csv-column'], // /[^,]+/
                [new RegExp(`${delimiter}`), 'csv-delimiter'], // /,/
            ]
        }
    });

}

function setupTheme() {
    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('jsonataTheme-light', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'variable', foreground: 'ff4000', background: '000000' },
            { token: 'csv-column', foreground: '000000' , background: '000000'},
            { token: 'csv-delimiter', foreground: 'ff4000', background: '000000' }
        ],
        colors: {
            "editor.background": '#F1F5F9',
        }
    });
    monaco.editor.defineTheme('jsonataTheme-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'variable', foreground: 'ff4000' },
            { token: 'csv-column', foreground: 'ffffff' },
            { token: 'csv-delimiter', foreground: 'ff4000' }
        ],
        colors: {
            // "editor.background": '#fffffb'
        }
    });
}

function setupLanguages() {
    setupJSONata();
    setupCsv(';');
    setupCsv(',');
    setupCsv('\t');
    setupTheme();
}

export { setupLanguages }
