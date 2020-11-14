import { expect } from 'chai';
import 'mocha';

import {SelectorSerializer} from './serializer';
import {SelectorParser} from './selector';

function testParsing(selectorString: string, result: string) {
	expect(result).to.equal(selectorString);
}

function testMatchingSelectorParsing(selectorString) {
	testParsing(selectorString, new SelectorSerializer().serializeMatchingSelectorToString(
		new SelectorParser().parseMatchingSelectorString(selectorString)
	));
}

function testSlotObjectSelectorParsing(selectorString) {
	testParsing(selectorString, new SelectorSerializer().serializeSlotObjectSelectorToString(
		new SelectorParser().parseSlotObjectSelectorString(selectorString)
	));
}

describe('Parser', () => {
	describe('parseMatchingSelectorString', () => {
		it('should parse root selector properly', () => {
			testMatchingSelectorParsing('Wizard');
		});

		it('should parse child type selector properly', () => {
			testMatchingSelectorParsing('Wizard > WizardStep');
		});

		it('should parse child property selector properly', () => {
			testMatchingSelectorParsing('Wizard::currentStep');
		});

		it('should parse complex selector properly', () => {
			testMatchingSelectorParsing('Wizard::currentStep[WizardStep][isEnabled(., \'str\')] > WizardBody');
		});
	});

	describe('parseSlotObjectSelectorString', () => {
		it('should parse root selector properly', () => {
			testSlotObjectSelectorParsing('.');
		});

		it('should parse child type selector properly', () => {
			testSlotObjectSelectorParsing('. > WizardStep');
		});

		it('should parse child property selector properly', () => {
			testSlotObjectSelectorParsing('.::currentStep');
		});

		it('should parse complex selector properly', () => {
			testSlotObjectSelectorParsing('.::currentStep[WizardStep][isEnabled(., \'str\')] > WizardBody');
		});
	});
});
