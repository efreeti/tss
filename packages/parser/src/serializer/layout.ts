import {LayoutDescriptor, LayoutChild, LayoutProperty} from '@ts-ss/ast';
import {ExpressionSerializer} from './expression';
import {SelectorSerializer} from './selector';

function reindent(string: string) {
	return string.replace(/\n/g, '\n\t');
}

export class LayoutSerializer {
	private selectorSerializer = new SelectorSerializer();
	private expressionSerializer = new ExpressionSerializer();

	serializeLayoutDescriptorToString(descriptor: LayoutDescriptor): string {
		const contentString = this.serializeLayoutDescriptorContentToString(descriptor);

		return contentString ? `{\n\t${reindent(contentString)}\n}` : '{}';
	}

	serializeLayoutDescriptorContentToString(descriptor: LayoutDescriptor): string {
		const separator = descriptor.children.length > 0 && descriptor.properties.length > 0 ? '\n\n' : '';

		return (
			descriptor.properties.map((property) => this.serializeLayoutPropertyToString(property)).join('\n') + (
				descriptor.children.length === 0 ? '' : `${separator}[\n\t${
					descriptor.children.map((child) => `${reindent(this.serializeLayoutChildToString(child))}`).join('\n\t')
				}\n]`
			)
		);
	}

	serializeLayoutPropertyToString(property: LayoutProperty): string {
		return `${property.name}: ${
			this.expressionSerializer.serializeStringsConcatenationExpressionToString(property.value).slice(1, -1)
		};`;
	}

	serializeLayoutChildToString(layoutChild: LayoutChild): string {
		if (layoutChild.type === 'TextChild') {
			return this.expressionSerializer.serializeStringsConcatenationExpressionToString(
				layoutChild.textExpression
			);
		} else if (layoutChild.type === 'LayerChild') {
			return this.serializeLayoutDescriptorToString(layoutChild.descriptor);
		} else if (layoutChild.type === 'SlotChild') {
			return this.selectorSerializer.serializeSlotObjectSelectorToString(layoutChild.selector);
		} else if (layoutChild.type === 'WrapperChild') {
			return `${this.selectorSerializer.serializeSlotObjectSelectorToString(layoutChild.selector)} ${
				this.serializeLayoutDescriptorToString(layoutChild.descriptor)
			}`;
		}
	}
}
