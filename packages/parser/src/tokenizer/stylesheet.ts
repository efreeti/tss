import {BaseTokenizer} from './base';

export type ImportTokens =
		'OPENING_CURLY_BRACE' |
		'CLOSING_CURLY_BRACE' |
		'COMMA' |
		'SEMI_COLON' |
		'IMPORT_KEYWORD' |
		'FROM_KEYWORD' |
		'IDENTIFIER' |
		'STRING_LITERAL';

export class ImportTokenizer extends BaseTokenizer<ImportTokens> {
	constructor() {
		super({
			OPENING_CURLY_BRACE: { pattern: /{/ },
			CLOSING_CURLY_BRACE: { pattern: /}/ },
			COMMA: { pattern: /,/ },
			SEMI_COLON: { pattern: /;/ },
			IMPORT_KEYWORD: { pattern: /import/ },
			FROM_KEYWORD: { pattern: /from/ },
			IDENTIFIER: { pattern: /[A-Za-z_$][A-Za-z0-9_$]*/ },
			STRING_LITERAL: { pattern: /("([^"\\]|\\"|\\\\)*"|'([^'\\]|\\'|\\\\)*')/ },
		});
	}
}

export type StylesheetTokens = 'IMPORT_STATEMENT' | 'OPENING_CURLY_BRACE' | 'CLOSING_CURLY_BRACE' | 'EVERYTHING_ELSE';

export class StylesheetTokenizer extends BaseTokenizer<StylesheetTokens> {
	constructor() {
		super({
			IMPORT_STATEMENT: { pattern: /import [^;]+;/ },
			OPENING_CURLY_BRACE: { pattern: /{/ },
			CLOSING_CURLY_BRACE: { pattern: /}/ },
			EVERYTHING_ELSE: { pattern: /[^{}]+/ },
		});
	}
}

