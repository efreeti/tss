import { StringsConcatenationExpression } from './expression';
import { SlotObjectSelector } from './selector';

export interface LayoutDescriptor {
	properties: Array<LayoutProperty>;
	children: Array<LayoutChild>;
}

export interface TextChild {
	type: 'TextChild';
	textExpression: StringsConcatenationExpression;
}

export interface LayerChild {
	type: 'LayerChild';
	descriptor: LayoutDescriptor;
}

export interface SlotChild {
	type: 'SlotChild';
	selector: SlotObjectSelector;
}

export interface WrapperChild {
	type: 'WrapperChild';
	selector: SlotObjectSelector;
	descriptor: LayoutDescriptor;
}

export interface NamedChild {
	type: 'NamedChild';
	name: string;
	child: AnonymousChild;
}

export type AnonymousChild = TextChild | LayerChild | SlotChild | WrapperChild;

export type LayoutChild = AnonymousChild | NamedChild;

export interface LayoutProperty {
	name: string;
	value: StringsConcatenationExpression;
}
