import { FunctionCallExpression } from './expression';

export interface RootMatchingSelector {
	type: 'RootMatchingSelector';
	predicate: CollectionItemsTypePredicate;
}

export interface ChildMatchingSelector {
	type: 'ChildMatchingSelector';
	predicate: CollectionItemsPredicate;
	parent: MatchingSelector;
}

export type MatchingSelector = RootMatchingSelector | ChildMatchingSelector;

export interface SlotContextObjectSelector {
	type: 'SlotContextObjectSelector';
}

export interface SlotChildObjectSelector {
	type: 'SlotChildObjectSelector';
	predicate: CollectionItemsPredicate;
	parent: SlotObjectSelector;
}

export type SlotObjectSelector = SlotContextObjectSelector | SlotChildObjectSelector;

export interface CollectionItemsOriginPredicate {
	type: 'CollectionItemsOriginPredicate';
	predicate: PropertyPredicate;
	subPredicate?: CollectionItemsTypePredicate | CollectionNarrowingPredicate;
}

export interface CollectionItemsTypePredicate {
	type: 'CollectionItemsTypePredicate';
	predicate: TypePredicate;
	subPredicate?: CollectionNarrowingPredicate;
}

export type CollectionItemsPredicate = CollectionItemsTypePredicate | CollectionItemsOriginPredicate;

export interface CollectionNarrowingPredicate {
	type: 'CollectionNarrowingPredicate';
	predicate: ExpressionPredicate;
	subPredicate?: CollectionNarrowingPredicate;
}

export interface AnyTypePredicate {
	type: 'AnyTypePredicate';
}

export interface ConcreteTypePredicate {
	type: 'ConcreteTypePredicate';
	typeName: string;
}

export type TypePredicate = AnyTypePredicate | ConcreteTypePredicate;

export interface PropertyPredicate {
	type: 'PropertyPredicate';
	propertyName: string;
}

export interface ExpressionPredicate {
	type: 'ExpressionPredicate';
	expression: FunctionCallExpression;
}
