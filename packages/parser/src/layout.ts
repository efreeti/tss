import {Parser, IAbstractParserElements} from 'tparser';

import {
	LayoutDescriptor,
	LayoutChild,
	TextChild,
	SlotChild,
	SlotObjectSelector,
	NamedChild, LayoutProperty
} from '@ts-ss/ast';

import {
	TokenElements,
	LayoutChildTokenizer,
	LayoutChildTokens, LayoutPropertyTokenizer,
	LayoutPropertyTokens,
	LayoutTopTokenizer,
	LayoutTopTokens
} from './tokenizer';

import {SELECTOR_PARSER_RULES, SelectorParserRules} from './selector';
import {ParserSymbol} from './base';


// ------------------------------------- CSS ------------------------------------
type LayoutPropertyParserRulesReference = LayoutPropertyParserRules;

export interface LayoutPropertyParserRules<
	T extends string = LayoutPropertyTokens,
	V extends LayoutPropertyParserRules = LayoutPropertyParserRulesReference
> {
	layout_properties: ParserSymbol<T, V, [
		[[], Array<LayoutProperty>],
		[[Array<LayoutProperty>, LayoutProperty], Array<LayoutProperty>]
	]>;
	layout_property: ParserSymbol<T, V, [
		[[string, string], LayoutProperty]
	]>;
}

export const LAYOUT_PROPERTY_PARSER_RULES: LayoutPropertyParserRules = {
	layout_properties: _ => [
		[[], () => []],
		[[_.layout_properties, _.layout_property], $ => $[0].concat([$[1]])],
	],
	layout_property: _ => [
		[[_.token.IDENTIFIER, _.token.CSS_VALUE], $ => ({
			name: $[0],
			value: {
				type: 'StringsConcatenationExpression',
				expressions: [{
					type: 'StringExpression',
					string: $[1].replace(/^:\s*|\s*;$/g, ''),
				}],
			}
		})],
	],
};

export class LayoutPropertyParser extends Parser<
	TokenElements<LayoutPropertyTokens>,
		LayoutPropertyParserRules & IAbstractParserElements<TokenElements<LayoutPropertyTokens>>
> {
	private tokenizer: LayoutPropertyTokenizer;

	constructor() {
		const tokenizer = new LayoutPropertyTokenizer();

		super({
			token: tokenizer.token(),
			tokenMap: tokenizer.tokenMap(),
			...LAYOUT_PROPERTY_PARSER_RULES
		});

		this.tokenizer = tokenizer;
	}

	parseLayoutPropertiesString(string: string): Array<LayoutProperty> {
		return super.parse(this.tokenizer.tokenize(string), 'layout_properties');
	}
}



// ------------------------------------- CHILDREN ------------------------------------
type LayoutChildParserRulesReference = LayoutChildParserRules;
type NotLayoutChild = TextChild | SlotChild | NamedChild;

export interface LayoutChildParserRules<
	T extends string = LayoutChildTokens,
	V extends LayoutChildParserRules = LayoutChildParserRulesReference
>
		extends SelectorParserRules<T, V> {

	layout_children: ParserSymbol<T, V, [
		[[], Array<NotLayoutChild>],
		[[Array<NotLayoutChild>, NotLayoutChild], Array<NotLayoutChild>]
	]>;
	layout_child: ParserSymbol<T, V, [
		[[string], TextChild],
		[[SlotObjectSelector], SlotChild],
		[[string, string, SlotObjectSelector], NamedChild],
		[[string, string, string], NamedChild],
		[[string, string], NamedChild]
	]>;
}

export const LAYOUT_CHILD_PARSER_RULES: LayoutChildParserRules = {
	...SELECTOR_PARSER_RULES,
	layout_children: _ => [
		[[], () => []],
		[[_.layout_children, _.layout_child], $ => $[0].concat([$[1]])],
	],
	layout_child: _ => [
		[[_.token.STRING_LITERAL], $ => ({
			type: 'TextChild',
			textExpression: {
				type: 'StringsConcatenationExpression',
				expressions: [{
					type: 'StringExpression',
					string: $[0].substr(1, $[0].length - 2),
				}],
			}
		})],
		[[_.slot_object_selector], $ => ({
			type: 'SlotChild',
			selector: $[0],
		})],
		[[_.token.IDENTIFIER, _.token.COLON, _.slot_object_selector], $ => ({
			type: 'NamedChild',
			name: $[0],
			child: {
				type: 'SlotChild',
				selector: $[2],
			},
		})],
		[[_.token.IDENTIFIER, _.token.COLON, _.token.STRING_LITERAL], $ => ({
			type: 'NamedChild',
			name: $[0],
			child: {
				type: 'TextChild',
				textExpression: {
					type: 'StringsConcatenationExpression',
					expressions: [{
						type: 'StringExpression',
						string: $[2].substr(1, $[2].length - 2),
					}],
				}
			},
		})],
		[[_.token.IDENTIFIER, _.token.COLON], $ => ({
			type: 'NamedChild',
			name: $[0],
			child: null,
		})],
	],
};

export class LayoutChildParser extends Parser<
	TokenElements<LayoutChildTokens>,
	LayoutChildParserRules & IAbstractParserElements<TokenElements<LayoutChildTokens>>
> {
	private tokenizer: LayoutChildTokenizer;

	constructor() {
		const tokenizer = new LayoutChildTokenizer();
		super({
			token: tokenizer.token(),
			tokenMap: tokenizer.tokenMap(),
			...LAYOUT_CHILD_PARSER_RULES
		});

		this.tokenizer = tokenizer;
	}

	parseLayoutChildrenString(string: string): Array<NotLayoutChild> {
		return super.parse(this.tokenizer.tokenize(string), 'layout_children');
	}
}



// ------------------------------------- TOP ------------------------------------
type LayoutTopParserRulesReference = LayoutTopParserRules;

export interface LayoutTopParserRules<
	T extends string = LayoutTopTokens,
	V extends LayoutTopParserRules = LayoutTopParserRulesReference
> {
	layout_descriptor: ParserSymbol<T, V, [
		[[string, LayoutDescriptor, string], LayoutDescriptor]
	]>;
	layout_descriptor_content: ParserSymbol<T, V, [
		[[], LayoutDescriptor],
		[[string], LayoutDescriptor],
		[[Array<LayoutChild>], LayoutDescriptor],
		[[LayoutDescriptor, Array<LayoutChild>], LayoutDescriptor]
	]>;
	children_descriptors_in_brackets: ParserSymbol<T, V, [
		[[string, Array<LayoutChild>, string], Array<LayoutChild>]
	]>;
	children_descriptors: ParserSymbol<T, V, [
		[[], Array<LayoutChild>],
		[[Array<LayoutChild>, LayoutDescriptor], Array<LayoutChild>],
		[[Array<LayoutChild>, string, LayoutDescriptor], Array<LayoutChild>],
		[[Array<LayoutChild>, string], Array<LayoutChild>]
	]>;
	non_layout_children_descriptors: ParserSymbol<T, V, [
		[[string], string],
		[[string, string], string],
		[[string, string], string]
	]>;
	everything_else_in_square_brackets: ParserSymbol<T, V, [
		[[string, string, string], string]
	]>;
}

export class LayoutParser extends Parser<
	TokenElements<LayoutTopTokens>,
	LayoutTopParserRules & IAbstractParserElements<TokenElements<LayoutTopTokens>>
> {
	private tokenizer: LayoutTopTokenizer;

	constructor() {
		const tokenizer = new LayoutTopTokenizer();
		const layoutChildParser = new LayoutChildParser();
		const layoutPropertyParser = new LayoutPropertyParser();

		super({
			token: tokenizer.token(),
			tokenMap: tokenizer.tokenMap(),
			layout_descriptor: _ => [
				[[_.token.OPENING_CURLY_BRACE, _.layout_descriptor_content, _.token.CLOSING_CURLY_BRACE], $ => $[1]],
			],
			layout_descriptor_content: _ => [
				[[], () => ({
					properties: [],
					children: [],
				})],
				[[_.token.EVERYTHING_ELSE], $ => ({
					properties: layoutPropertyParser.parseLayoutPropertiesString($[0]),
					children: [],
				})],
				[[_.children_descriptors_in_brackets], $ => ({
					properties: [],
					children: $[0],
				})],
				[[_.layout_descriptor_content, _.children_descriptors_in_brackets], $ => ({
					properties: $[0].properties,
					children: $[0].children.concat($[1])
				})],
			],
			children_descriptors_in_brackets: _ => [
				[[_.token.OPENING_SQUARE_BRACKET, _.children_descriptors, _.token.CLOSING_SQUARE_BRACKET], $ => $[1]],
			],
			children_descriptors: _ => [
				[[], () => []],
				[[_.children_descriptors, _.layout_descriptor], $ => $[0].concat([{
					type: 'LayerChild',
					descriptor: $[1],
				}])],
				[[_.children_descriptors, _.non_layout_children_descriptors, _.layout_descriptor], $ => {
					const children = layoutChildParser.parseLayoutChildrenString($[1]);
					const lastChild = children[children.length - 1];

					if (lastChild.type === 'TextChild') {
						return $[0].concat(children).concat([{
							type: 'LayerChild',
							descriptor: $[2],
						}]);
					} else if (lastChild.type === 'SlotChild') {
						return $[0].concat(children.slice(0, -1)).concat([{
							type: 'WrapperChild',
							selector: lastChild.selector,
							descriptor: $[2],
						}]);
					} else {
						if (lastChild.child === null) {
							return $[0].concat(children.slice(0, -1)).concat([{
								...lastChild,
								child: {
									type: 'LayerChild',
									descriptor: $[2],
								}
							}]);
						} else if (lastChild.child.type === 'SlotChild') {
							return $[0].concat(children.slice(0, -1)).concat([{
								...lastChild,
								child: {
									type: 'WrapperChild',
									selector: lastChild.child.selector,
									descriptor: $[2],
								}
							}]);
						} else {
							return $[0].concat(children).concat([{
								type: 'LayerChild',
								descriptor: $[2],
							}]);
						}
					}
				}],
				[[_.children_descriptors, _.non_layout_children_descriptors], $ => $[0].concat(
					layoutChildParser.parseLayoutChildrenString($[1])
				)],
			],
			non_layout_children_descriptors: _ => [
				[[_.token.EVERYTHING_ELSE], $ => $[0]],
				[[_.non_layout_children_descriptors, _.token.EVERYTHING_ELSE], $ => $.join('')],
				[[_.non_layout_children_descriptors, _.everything_else_in_square_brackets], $ => $.join('')],
			],
			everything_else_in_square_brackets: _ => [
				[[_.token.OPENING_SQUARE_BRACKET, _.token.EVERYTHING_ELSE, _.token.CLOSING_SQUARE_BRACKET], $ => $.join('')],
			],
		});

		this.tokenizer = tokenizer;
	}

	parseLayoutDescriptor(string: string): LayoutDescriptor {
		return super.parse(this.tokenizer.tokenize(string), 'layout_descriptor');
	}
}
