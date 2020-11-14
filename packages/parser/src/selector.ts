import {Parser, IAbstractParserElements} from 'tparser';

import {
	MatchingSelector,
	RootMatchingSelector,
	ChildMatchingSelector,
	SlotObjectSelector,
	SlotContextObjectSelector,
	SlotChildObjectSelector,
	CollectionItemsOriginPredicate,
	CollectionItemsTypePredicate,
	CollectionNarrowingPredicate,
	ExpressionPredicate,
	PropertyPredicate,
	TypePredicate,
	AnyTypePredicate,
	ConcreteTypePredicate,
	ValueExpression,
	FunctionCallExpression,
	ContextObjectExpression,
	StringExpression,
} from '@ts-ss/ast';

import {TokenElements, SelectorTokens, SelectorTokenizer} from './tokenizer'
import {ParserSymbol} from './base';

type SelectorParserRulesReference = SelectorParserRules;

export interface SelectorParserRules<
	T extends string = SelectorTokens,
	V extends SelectorParserRules = SelectorParserRulesReference
> {
	matching_selector: ParserSymbol<T, V, [
		[[CollectionItemsTypePredicate], RootMatchingSelector],
		[[MatchingSelector, string, CollectionItemsTypePredicate], ChildMatchingSelector],
		[[MatchingSelector, string, CollectionItemsOriginPredicate], ChildMatchingSelector]
	]>;
	slot_object_selector: ParserSymbol<T, V, [
		[[ContextObjectExpression], SlotContextObjectSelector],
		[[SlotObjectSelector, string, CollectionItemsTypePredicate], SlotChildObjectSelector],
		[[SlotObjectSelector, string, CollectionItemsOriginPredicate], SlotChildObjectSelector]
	]>;
	collection_items_origin_predicate: ParserSymbol<T, V, [
		[[PropertyPredicate], CollectionItemsOriginPredicate],
		[[PropertyPredicate, CollectionItemsTypePredicate], CollectionItemsOriginPredicate],
		[[PropertyPredicate, CollectionNarrowingPredicate], CollectionItemsOriginPredicate]
	]>;
	collection_items_type_predicate: ParserSymbol<T, V, [
		[[TypePredicate], CollectionItemsTypePredicate],
		[[TypePredicate, CollectionNarrowingPredicate], CollectionItemsTypePredicate]
	]>;
	collection_items_type_predicate_with_brackets: ParserSymbol<T, V, [
		[[TypePredicate], CollectionItemsTypePredicate],
		[[TypePredicate, CollectionNarrowingPredicate], CollectionItemsTypePredicate]
	]>;
	collection_narrowing_predicate: ParserSymbol<T, V, [
		[[ExpressionPredicate], CollectionNarrowingPredicate],
		[[ExpressionPredicate, CollectionNarrowingPredicate], CollectionNarrowingPredicate]
	]>;
	expression_predicate_in_brackets: ParserSymbol<T, V, [
		[[string, ExpressionPredicate, string], ExpressionPredicate]
	]>;
	expression_predicate: ParserSymbol<T, V, [
		[[FunctionCallExpression], ExpressionPredicate]
	]>;
	type_predicate_in_brackets: ParserSymbol<T, V, [
		[[string, TypePredicate, string], TypePredicate]
	]>;
	type_predicate: ParserSymbol<T, V, [
		[[string], AnyTypePredicate],
		[[string], ConcreteTypePredicate]
	]>;
	property_predicate: ParserSymbol<T, V, [
		[[string], PropertyPredicate]
	]>;
	value_expression: ParserSymbol<T, V, [
		[[FunctionCallExpression], FunctionCallExpression],
		[[string], StringExpression],
		[[string], ContextObjectExpression]
	]>;
	function_call_expression: ParserSymbol<T, V, [
		[[string, string, Array<ValueExpression>, string], FunctionCallExpression]
	]>;
	parameters_list_expression: ParserSymbol<T, V, [
		[[Array<ValueExpression>, string, ValueExpression], Array<ValueExpression>],
		[[ValueExpression], Array<ValueExpression>],
		[[], Array<ValueExpression>]
	]>;
}

export const SELECTOR_PARSER_RULES: SelectorParserRules = {
	matching_selector: _ => [
		[[_.collection_items_type_predicate], $ => ({
			type: 'RootMatchingSelector',
			predicate: $[0],
		})],
		[[_.matching_selector, _.token.GREATER_THAN, _.collection_items_type_predicate], $ => ({
			type: 'ChildMatchingSelector',
			predicate: $[2],
			parent: $[0],
		})],
		[[_.matching_selector, _.token.DOUBLE_COLON, _.collection_items_origin_predicate], $ => ({
			type: 'ChildMatchingSelector',
			predicate: $[2],
			parent: $[0],
		})],
	],
	slot_object_selector: _ => [
		[[_.token.DOT], () => ({
			type: 'SlotContextObjectSelector',
		})],
		[[_.slot_object_selector, _.token.GREATER_THAN, _.collection_items_type_predicate], $ => ({
			type: 'SlotChildObjectSelector',
			predicate: $[2],
			parent: $[0],
		})],
		[[_.slot_object_selector, _.token.DOUBLE_COLON, _.collection_items_origin_predicate], $ => ({
			type: 'SlotChildObjectSelector',
			predicate: $[2],
			parent: $[0],
		})],
	],
	collection_items_origin_predicate: _ => [
		[[_.property_predicate], $ => ({
			type: 'CollectionItemsOriginPredicate',
			predicate: $[0],
		})],
		[[_.property_predicate, _.collection_items_type_predicate_with_brackets], $ => ({
			type: 'CollectionItemsOriginPredicate',
			predicate: $[0],
			subPredicate: $[1],
		})],
		[[_.property_predicate, _.collection_narrowing_predicate], $ => ({
			type: 'CollectionItemsOriginPredicate',
			predicate: $[0],
			subPredicate: $[1],
		})],
	],
	collection_items_type_predicate: _ => [
		[[_.type_predicate], $ => ({
			type: 'CollectionItemsTypePredicate',
			predicate: $[0],
		})],
		[[_.type_predicate, _.collection_narrowing_predicate], $ => ({
			type: 'CollectionItemsTypePredicate',
			predicate: $[0],
			subPredicate: $[1],
		})],
	],
	collection_items_type_predicate_with_brackets: _ => [
		[[_.type_predicate_in_brackets], $ => ({
			type: 'CollectionItemsTypePredicate',
			predicate: $[0],
		})],
		[[_.type_predicate_in_brackets, _.collection_narrowing_predicate], $ => ({
			type: 'CollectionItemsTypePredicate',
			predicate: $[0],
			subPredicate: $[1],
		})],
	],
	collection_narrowing_predicate: _ => [
		[[_.expression_predicate_in_brackets], $ => ({
			type: 'CollectionNarrowingPredicate',
			predicate: $[0],
		})],
		[[_.expression_predicate_in_brackets, _.collection_narrowing_predicate], $ => ({
			type: 'CollectionNarrowingPredicate',
			predicate: $[0],
			subPredicate: $[1],
		})],
	],
	expression_predicate_in_brackets: _ => [
		[[_.token.OPENING_SQUARE_BRACKET, _.expression_predicate, _.token.CLOSING_SQUARE_BRACKET], $ => $[1]],
	],
	expression_predicate: _ => [
		[[_.function_call_expression], $ => ({
			type: 'ExpressionPredicate',
			expression: $[0],
		})],
	],
	type_predicate_in_brackets: _ => [
		[[_.token.OPENING_SQUARE_BRACKET, _.type_predicate, _.token.CLOSING_SQUARE_BRACKET], $ => $[1]],
	],
	type_predicate: _ => [
		[[_.token.STAR], () => ({
			type: 'AnyTypePredicate',
		})],
		[[_.token.IDENTIFIER], $ => ({
			type: 'ConcreteTypePredicate',
			typeName: $[0],
		})],
	],
	property_predicate: _ => [
		[[_.token.IDENTIFIER], $ => ({
			type: 'PropertyPredicate',
			propertyName: $[0],
		})],
	],
	value_expression: _ => [
		[[_.function_call_expression], $ => $[0]],
		[[_.token.STRING_LITERAL], $ => ({
			type: 'StringExpression',
			string: $[0].substr(1, $[0].length - 2),
		})],
		[[_.token.DOT], () => ({
			type: 'ContextObjectExpression',
		})]
	],
	function_call_expression: _ => [
		[[_.token.IDENTIFIER, _.token.OPENING_PARENTHESES, _.parameters_list_expression, _.token.CLOSING_PARENTHESES], $ => ({
			type: 'FunctionCallExpression',
			functionName: $[0],
			parameters: $[2],
		})],
	],
	parameters_list_expression: _ => [
		[[_.parameters_list_expression, _.token.COMMA, _.value_expression], $ => $[0].concat([$[2]])],
		[[_.value_expression], $ => [$[0]]],
		[[], () => []]
	]
};

export class SelectorParser extends Parser<
	TokenElements<SelectorTokens>,
	SelectorParserRules & IAbstractParserElements<TokenElements<SelectorTokens>>
> {
	private tokenizer: SelectorTokenizer;

	constructor() {
		const tokenizer = new SelectorTokenizer();

		super({
			token: tokenizer.token(),
			tokenMap: tokenizer.tokenMap(),
			...SELECTOR_PARSER_RULES
		});

		this.tokenizer = tokenizer;
	}

	parseMatchingSelectorString(string: string): MatchingSelector {
		return super.parse(this.tokenizer.tokenize(string), 'matching_selector');
	}

	parseSlotObjectSelectorString(string: string): SlotObjectSelector {
		return super.parse(this.tokenizer.tokenize(string), 'slot_object_selector');
	}
}
