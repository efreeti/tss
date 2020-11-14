import {IAbstractParserElements} from 'tparser/lib/parser';
import {TokenElements} from './tokenizer';

export type ParserRuleItem<T extends [any[], any]> = [any[], ($: T[0]) => T[1]];

export type ParserRule<T extends Array<[any[], any]>> =
		{ [P in keyof T]: T[P] extends [any[], any] ? ParserRuleItem<T[P]> : never };

export type ParserSymbol<T extends string, V, U extends Array<[any[], any]>> =
		(_: V & IAbstractParserElements<TokenElements<T>>) => ParserRule<U>;
