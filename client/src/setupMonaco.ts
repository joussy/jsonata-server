import * as monaco from 'monaco-editor'

//Helper function to simplify snippet setup
function createMonacoCompletionItem(label: string, insertText: string, documentation: string | object, range: object, kind: number) {
    if (Array.isArray(documentation)) { documentation = documentation .join("\n"); }
    return {
        label: label,
        kind: kind == null ? monaco.languages.CompletionItemKind.Snippet : kind,
        documentation: { value: documentation },
        insertText: insertText,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
    }
}

function setupJSONata(_monaco: monaco.editor.IStandaloneEditorConstructionOptions) {
    // Register the language 'jsonata'
    monaco.languages.register({ id: 'jsonata' });

    // Setup tokens for JSONata
    monaco.languages.setMonarchTokensProvider('jsonata',
        {
            // Set defaultToken to invalid to see what you do not tokenize yet
            defaultToken: 'invalid',
            tokenPostfix: '.js',
            keywords: ["function", "true", "true", "null", "Infinity", "NaN", "undefined"].concat(Object.keys(jsonata.functions)),
            // keywords: [
            //     "function", "$abs", "$append", "$assert", "$average",
            //     "$base64decode", "$base64encode", "$boolean", "$ceil", "$contains",
            //     "$count", "$decodeUrl", "$decodeUrlComponent", "$distinct", "$each", "$encodeUrl",
            //     "$encodeUrlComponent", "$env", "$error", "$eval", "$exists", "$filter", "$floor",
            //     "$flowContext", "$formatBase", "$formatInteger", "$formatNumber", "$fromMillis",
            //     "$globalContext", "$join", "$keys", "$length", "$lookup", "$lowercase", "$map",
            //     "$match", "$max", "$merge", "$millis", "$min", "$moment", "$not", "$now",
            //     "$number", "$pad", "$parseInteger", "$power", "$random", "$reduce", "$replace",
            //     "$reverse", "$round", "$shuffle", "$sift", "$single", "$sort", "$split",
            //     "$spread", "$sqrt", "$string", "$substring", "$substringAfter", "$substringBefore",
            //     "$sum", "$toMillis", "$trim", "$type", "$uppercase", "$zip"
            // ],

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
            var jsonataFunctions = Object.keys(jsonata.functions);
            var jsonataSuggestions = jsonataFunctions.map(function (f) {
                var args = RED._('jsonata:' + f + '.args', { defaultValue: '' });
                var title = f + '(' + args + ')';
                var body = RED._('jsonata:' + f + '.desc', { defaultValue: '' });
                var insertText = (jsonata.getFunctionSnippet(f) + '').trim();
                var documentation = { value: '`' + title + '`\n\n' + body };
                return createMonacoCompletionItem(f, insertText, documentation, range, monaco.languages.CompletionItemKind.Function);
            });
            // sort in length order (long->short) otherwise substringAfter gets matched as substring etc.
            jsonataFunctions.sort(function (A, B) {
                return B.length - A.length;
            });
            // add snippets to suggestions
            jsonataSuggestions.unshift(
                createMonacoCompletionItem("randominteger", '(\n\t\\$minimum := ${1:1};\n\t\\$maximum := ${2:10};\n\t\\$round((\\$random() * (\\$maximum-\\$minimum)) + \\$minimum, 0)\n)', 'Random integer between 2 numbers', range, null)
            );//TODO: add more JSONata snippets
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
            var args = RED._('jsonata:' + f + ".args", { defaultValue: '' });
            if (!args) { return; }
            var title = f + "(" + args + ")";
            var body = RED._('jsonata:' + f + '.desc', { defaultValue: '' });

            /** @type {monaco.Range} */
            var r = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column + (w?.word?.length ?? 0));
            return {
                range: r,
                contents: [
                    { value: '**`' + title + '`**' },
                    // { value: '```html\n' + body + '\n```' },
                    { value: body },
                ]
            }
        }
    });
}