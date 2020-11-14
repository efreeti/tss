import { RuleSet, Import, Rule } from '@ts-ss/ast';
import { SelectorSerializer } from './selector';
import { LayoutSerializer } from './layout';

export class StylesheetSerializer {
	private layoutSerializer = new LayoutSerializer();
	private selectorSerializer = new SelectorSerializer();

	serializeRuleSetToString(ruleSet: RuleSet): string {
		const separator = ruleSet.imports.length > 0 && ruleSet.rules.length > 0 ? '\n\n' : '';

		return (
			`${ruleSet.imports.map((importItem) => this.serializeImportToString(importItem)).join('\n')}${separator}${
				ruleSet.rules.map((rule) => this.serializeRuleToString(rule)).join('\n')
			}`
		);
	}

	serializeImportToString(importItem: Import): string {
		const separator = importItem.defaultSymbol && importItem.symbols.length > 0 ? ', ' : '';
		const symbols = importItem.symbols.length === 0 ? '' : `{${importItem.symbols.join(', ')}}`;
		const defaultSymbol = importItem.defaultSymbol || '';

		return `import ${defaultSymbol}${separator}${symbols} from '${importItem.path}';`;
	}

	serializeRuleToString(rule: Rule): string {
		return `${this.selectorSerializer.serializeMatchingSelectorToString(rule.selector)} ${
			this.layoutSerializer.serializeLayoutDescriptorToString(rule.descriptor)
		}`;
	}
}
