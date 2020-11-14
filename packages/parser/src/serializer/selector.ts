import {
	MatchingSelector,
	SlotObjectSelector,
	CollectionItemsPredicate,
	CollectionItemsOriginPredicate,
	CollectionItemsTypePredicate,
	CollectionNarrowingPredicate,
	TypePredicate,
} from '@ts-ss/ast';

import {ExpressionSerializer} from './expression';

export class SelectorSerializer {
	private expressionSerializer = new ExpressionSerializer();

	serializeMatchingSelectorToString(selector: MatchingSelector): string {
		if (selector.type === 'RootMatchingSelector') {
			return this.serializeCollectionItemsTypePredicateToString(selector.predicate);
		} else {
			const parentString = this.serializeMatchingSelectorToString(selector.parent);
			const separator = this.serializeCollectionItemsPredicateToSeparatorString(selector.predicate);

			return `${parentString}${separator}${this.serializeCollectionItemsPredicateToString(selector.predicate)}`;
		}
	}

	serializeSlotObjectSelectorToString(selector: SlotObjectSelector): string {
		if (selector.type === 'SlotContextObjectSelector') {
			return '.';
		} else {
			const parentString = this.serializeSlotObjectSelectorToString(selector.parent);
			const separator = this.serializeCollectionItemsPredicateToSeparatorString(selector.predicate);

			return `${parentString}${separator}${this.serializeCollectionItemsPredicateToString(selector.predicate)}`;
		}
	}

	serializeCollectionItemsPredicateToSeparatorString(predicate: CollectionItemsPredicate): string {
		return predicate.type === 'CollectionItemsOriginPredicate' ? '::' : ' > ';
	}

	serializeCollectionItemsPredicateToString(predicate: CollectionItemsPredicate): string {
		if (predicate.type === 'CollectionItemsOriginPredicate') {
			return this.serializeCollectionItemsOriginPredicateToString(predicate);
		} else {
			return this.serializeCollectionItemsTypePredicateToString(predicate);
		}
	}

	serializeCollectionItemsTypePredicateToString(predicate: CollectionItemsTypePredicate, inBrackets?: boolean): string {
		return `${inBrackets ? '[' : ''}${this.serializeTypePredicateToString(predicate.predicate)}${inBrackets ? ']' : ''}${
			predicate.subPredicate ? this.serializeCollectionNarrowingPredicateToString(predicate.subPredicate) : ''
		}`;
	}

	serializeCollectionNarrowingPredicateToString(predicate: CollectionNarrowingPredicate): string {
		return `[${this.expressionSerializer.serializeFunctionCallExpressionToString(predicate.predicate.expression)}]${
			predicate.subPredicate ? this.serializeCollectionNarrowingPredicateToString(predicate.subPredicate) : ''
		}`;
	}

	serializeCollectionItemsOriginSubPredicateToString(predicate: CollectionItemsTypePredicate | CollectionNarrowingPredicate): string {
		if (predicate.type === 'CollectionItemsTypePredicate') {
			return this.serializeCollectionItemsTypePredicateToString(predicate, true);
		} else {
			return this.serializeCollectionNarrowingPredicateToString(predicate);
		}
	}

	serializeCollectionItemsOriginPredicateToString(predicate: CollectionItemsOriginPredicate): string {
		return `${predicate.predicate.propertyName}${
			predicate.subPredicate ? this.serializeCollectionItemsOriginSubPredicateToString(predicate.subPredicate) : ''
		}`;
	}

	serializeTypePredicateToString(predicate: TypePredicate): string {
		if (predicate.type === 'ConcreteTypePredicate') {
			return predicate.typeName;
		} else {
			return '*';
		}
	}
}
