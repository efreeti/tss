import {Parser, IAbstractParserElements} from 'tparser';

import {Import, LayoutDescriptor, Rule, RuleSet} from '@ts-ss/ast';

import {
	TokenElements,
	StylesheetTokens,
	StylesheetTokenizer,
	ImportTokens,
	ImportTokenizer
} from './tokenizer'

import {ParserSymbol} from './base';
import {SelectorParser} from './selector';
import {LayoutParser} from './layout';


// ------------------------------------- IMPORT ------------------------------------
type ImportParserRulesReference = ImportParserRules;

export interface ImportParserRules<
	T extends string = ImportTokens,
	V extends ImportParserRules = ImportParserRulesReference
> {
	import: ParserSymbol<T, V, [
		[[string, [string | undefined, Array<string>], string, string], Import]
	]>;
	import_symbols: ParserSymbol<T, V, [
		[[string], [string, []]],
		[[Array<string>], [undefined, Array<string>]],
		[[string, string, Array<string>], [string, Array<string>]]
	]>;
	non_default_import_symbols_in_braces: ParserSymbol<T, V, [
		[[string, string], Array<string>],
		[[string, Array<string>, string], Array<string>]
	]>;
	non_default_import_symbols: ParserSymbol<T, V, [
		[[string], Array<string>],
		[[Array<string>, string, string], Array<string>]
	]>;
}

export const IMPORT_PARSER_RULES: ImportParserRules = {
	import: _ => [
		[[_.token.IMPORT_KEYWORD, _.import_symbols, _.token.FROM_KEYWORD, _.token.STRING_LITERAL, _.token.SEMI_COLON], $ => ({
			path: $[3].substr(1, $[3].length - 2),
			symbols: $[1][1],
			defaultSymbol: $[1][0]
		})],
	],
	import_symbols: _ => [
		[[_.token.IDENTIFIER], $ => [$[0], []]],
		[[_.non_default_import_symbols_in_braces], $ => [undefined, $[0]]],
		[[_.token.IDENTIFIER, _.token.COMMA, _.non_default_import_symbols_in_braces], $ => [$[0], $[2]]],
	],
	non_default_import_symbols_in_braces: _ => [
		[[_.token.OPENING_CURLY_BRACE, _.token.CLOSING_CURLY_BRACE], () => []],
		[[_.token.OPENING_CURLY_BRACE, _.non_default_import_symbols, _.token.CLOSING_CURLY_BRACE], $ => $[1]],
	],
	non_default_import_symbols: _ => [
		[[_.token.IDENTIFIER], $ => [$[0]]],
		[[_.non_default_import_symbols, _.token.COMMA, _.token.IDENTIFIER], $ => $[0].concat([$[2]])],
	],
};

export class ImportParser extends Parser<
	TokenElements<ImportTokens>,
	ImportParserRules & IAbstractParserElements<TokenElements<ImportTokens>>
> {
	private tokenizer: ImportTokenizer;

	constructor() {
		const tokenizer = new ImportTokenizer();

		super({
			token: tokenizer.token(),
			tokenMap: tokenizer.tokenMap(),
			...IMPORT_PARSER_RULES
		});

		this.tokenizer = tokenizer;
	}

	parseImportString(string: string): Import {
		return super.parse(this.tokenizer.tokenize(string), 'import');
	}
}


// ------------------------------------- TOP ------------------------------------
type TopParserRulesReference = TopParserRules;

export interface TopParserRules<
	T extends string = StylesheetTokens,
	V extends TopParserRules = TopParserRulesReference
> {
	rule_set: ParserSymbol<T, V, [
		[[Array<Import>], RuleSet],
		[[Array<Rule>], RuleSet],
		[[Array<Import>, Array<Rule>], RuleSet]
	]>;
	imports: ParserSymbol<T, V, [
		[[Import], Array<Import>],
		[[Array<Import>, Import], Array<Import>]
	]>;
	import: ParserSymbol<T, V, [
		[[string], Import]
	]>;
	rules: ParserSymbol<T, V, [
		[[Rule], Array<Rule>],
		[[Array<Rule>, Rule], Array<Rule>]
	]>;
	rule: ParserSymbol<T, V, [
		[[string, LayoutDescriptor], Rule]
	]>;
	layout_descriptor: ParserSymbol<T, V, [
		[[string], LayoutDescriptor]
	]>;
	layout_descriptor_string: ParserSymbol<T, V, [
		[[string, string, string], string]
	]>;
	layout_descriptor_body_string: ParserSymbol<T, V, [
		[[string], string],
		[[string, string, string], string]
	]>;
}

export class StylesheetParser extends Parser<
	TokenElements<StylesheetTokens>,
	TopParserRules & IAbstractParserElements<TokenElements<StylesheetTokens>>
> {
	private tokenizer: StylesheetTokenizer;

	constructor() {
		const tokenizer = new StylesheetTokenizer();
		const importParser = new ImportParser();
		const selectorParser = new SelectorParser();
		const layoutParser = new LayoutParser();

		super({
			token: tokenizer.token(),
			tokenMap: tokenizer.tokenMap(),
			rule_set: _ => [
				[[_.imports], $ => ({
					imports: $[0],
					rules: [],
				})],
				[[_.rules], $ => ({
					imports: [],
					rules: $[0],
				})],
				[[_.imports, _.rules], $ => ({
					imports: $[0],
					rules: $[1],
				})],
			],
			imports: _ => [
				[[_.import], $ => [$[0]]],
				[[_.imports, _.import], $ => $[0].concat($[1])],
			],
			import: _ => [
				[[_.token.IMPORT_STATEMENT], $ => importParser.parseImportString($[0])],
			],
			rules: _ => [
				[[_.rule], $ => [$[0]]],
				[[_.rules, _.rule], $ => $[0].concat($[1])],
			],
			rule: _ => [
				[[_.token.EVERYTHING_ELSE, _.layout_descriptor], $ => ({
					selector: selectorParser.parseMatchingSelectorString($[0]),
					descriptor: $[1],
				})],
			],
			layout_descriptor: _ => [
				[[_.layout_descriptor_string], $ => {
					return layoutParser.parseLayoutDescriptor($[0])
				}],
			],
			layout_descriptor_string: _ => [
				[[_.token.OPENING_CURLY_BRACE, _.layout_descriptor_body_string, _.token.CLOSING_CURLY_BRACE], $ => $.join('')],
			],
			layout_descriptor_body_string: _ => [
				[[_.token.EVERYTHING_ELSE], $ => $[0]],
				[[_.layout_descriptor_body_string, _.layout_descriptor_string, _.token.EVERYTHING_ELSE], $ => $.join('')]
			]
		});

		this.tokenizer = tokenizer;
	}

	parseRuleSetString(string: string): RuleSet {
		return super.parse(this.tokenizer.tokenize(string), 'rule_set');
	}
}
