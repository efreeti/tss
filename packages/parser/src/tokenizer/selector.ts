import {BaseTokenizer, TokenDefinitions} from './base';

export type SelectorTokens =
	'STRING_LITERAL' |
	'IDENTIFIER' |
	'STAR' |
	'GREATER_THAN' |
	'DOUBLE_COLON' |
	'DOT' |
	'COMMA' |
	'OPENING_PARENTHESES' |
	'CLOSING_PARENTHESES' |
	'OPENING_SQUARE_BRACKET' |
	'CLOSING_SQUARE_BRACKET';

export const SELECTOR_TOKENS: TokenDefinitions<SelectorTokens> = {
	STRING_LITERAL: { pattern: /("([^"\\]|\\"|\\\\)*"|'([^'\\]|\\'|\\\\)*')/ },
	IDENTIFIER: { pattern: /[A-Za-z_][A-Za-z0-9_]*/ },
	STAR: { pattern: /\*/ },
	GREATER_THAN: { pattern: />/ },
	DOUBLE_COLON: { pattern: /::/ },
	DOT: { pattern: /\./ },
	COMMA: { pattern: /,/ },
	OPENING_PARENTHESES: { pattern: /\(/ },
	CLOSING_PARENTHESES: { pattern: /\)/ },
	OPENING_SQUARE_BRACKET: { pattern: /\[/ },
	CLOSING_SQUARE_BRACKET: { pattern: /]/ },
};

export class SelectorTokenizer extends BaseTokenizer<SelectorTokens> {
	constructor() {
		super(SELECTOR_TOKENS);
	}
}

