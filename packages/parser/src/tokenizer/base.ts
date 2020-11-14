import { Tokenizer } from 'tparser';

export interface TokenDefinition {
	pattern: RegExp;
	wordLike?: boolean;
}

export type TokenDefinitions<T extends string> = {
	[K in T]: TokenDefinition;
};

export type TokenElements<T extends string> = {
	[K in T | 'split']: RegExp;
};

function definitionToPattern(definition: TokenDefinition): string {
	if (definition.wordLike) {
		return `\\b${definition.pattern.source}\\b`;
	} else {
		return `${definition.pattern.source}`;
	}
}

function createTokenRegExp(definition: TokenDefinition) {
	return new RegExp(`^${definitionToPattern(definition)}$`);
}

function createSplitRegexp<T extends string>(definitions: TokenDefinitions<T>) {
	const patternStrings = Object.keys(definitions).map(
		name => definitionToPattern(definitions[name])
	);

	return new RegExp(`\\s*(${patternStrings.join('|')})\\s*`, 'y');
}

export class BaseTokenizer<T extends string> extends Tokenizer<TokenElements<T>> {
	constructor(definitions: TokenDefinitions<T>) {
		super({
			split: createSplitRegexp(definitions),
			...(Object.keys(definitions).reduce(
				(result, name) => {
					result[name] = createTokenRegExp(definitions[name]);

					return result;
				},
				{}
			) as TokenElements<T>)
		});
	}
}
