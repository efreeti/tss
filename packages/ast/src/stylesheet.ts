import {MatchingSelector} from './selector';
import {LayoutDescriptor} from './layout';

export interface Import {
	path: string;
	symbols: Array<string>;
	defaultSymbol?: string;
}

export interface Rule {
	selector: MatchingSelector;
	descriptor: LayoutDescriptor;
}

export interface RuleSet {
	imports: Array<Import>;
	rules: Array<Rule>;
}
