import {BaseTokenizer, TokenDefinitions} from './base';
import {SELECTOR_TOKENS, SelectorTokens} from './selector';

export type LayoutPropertyTokens = 'CSS_VALUE' | 'IDENTIFIER';

export const LAYOUT_PROPERTY_TOKENS: TokenDefinitions<LayoutPropertyTokens> = {
	CSS_VALUE: { pattern: /:[^:;]+;/ },
	IDENTIFIER: { pattern: /[-]?[-]?[a-z_]+[a-z0-9_-]+[a-z0-9_]+/, wordLike: true },
};

export class LayoutPropertyTokenizer extends BaseTokenizer<LayoutPropertyTokens> {
	constructor() {
		super(LAYOUT_PROPERTY_TOKENS);
	}
}

export type LayoutChildTokens = SelectorTokens | 'COLON';

export const LAYOUT_CHILD_TOKENS: TokenDefinitions<LayoutChildTokens> = {
	...SELECTOR_TOKENS,
	COLON: { pattern: /:/ },
};

export class LayoutChildTokenizer extends BaseTokenizer<LayoutChildTokens> {
	constructor() {
		super(LAYOUT_CHILD_TOKENS);
	}
}

export type LayoutTopTokens =
	'OPENING_CURLY_BRACE' |
	'CLOSING_CURLY_BRACE' |
	'OPENING_SQUARE_BRACKET' |
	'CLOSING_SQUARE_BRACKET' |
	'EVERYTHING_ELSE';

export const LAYOUT_TOP_TOKENS: TokenDefinitions<LayoutTopTokens> = {
	OPENING_CURLY_BRACE: { pattern: /{/ },
	CLOSING_CURLY_BRACE: { pattern: /}/ },
	OPENING_SQUARE_BRACKET: { pattern: /\[/ },
	CLOSING_SQUARE_BRACKET: { pattern: /]/ },
	EVERYTHING_ELSE: {pattern: /[^{}[\]]+/},
};

export class LayoutTopTokenizer extends BaseTokenizer<LayoutTopTokens> {
	constructor() {
		super(LAYOUT_TOP_TOKENS);
	}
}
