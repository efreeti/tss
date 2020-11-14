import {expect} from 'chai';
import 'mocha';

import {StylesheetSerializer} from './serializer';
import {StylesheetParser} from './stylesheet';

function testParsing(ruleSetString: string, result: string) {
	expect(result).to.equal(ruleSetString);
}

function testLayoutDescriptorParsing(ruleSetString) {
	testParsing(ruleSetString, new StylesheetSerializer().serializeRuleSetToString(
		new StylesheetParser().parseRuleSetString(ruleSetString)
	));
}

describe('Parser', () => {
	describe('parseRuleSetString', () => {
		it('should parse only imports properly', () => {
			testLayoutDescriptorParsing(
				`import bla from './path';\n` +
				`import {bla1, bla2} from './path';\n` +
				`import bla, {bla1, bla2} from './path';`
			);
		});

		it('should parse only rules properly', () => {
			testLayoutDescriptorParsing(
				'Window > Wizard {\n' +
					'\tdisplay: none;\n' +
					'\tposition: absolute;\n' +
					'\twidth: 100px;\n' +
					'\theight: 100px;\n' +
					'\tmargin: 10px 10px 10px 10px;\n' +
					'\t\n' +
					'\t[\n' +
						'\t\t. > Wizard::currentStep > WizardBody[isDisabled(.)][isFirst(., \'string\')]\n' +
						'\t\t\'some text\'\n' +
						'\t\t{\n' +
							'\t\t\tdisplay: none;\n' +
							'\t\t\tposition: absolute;\n' +
							'\t\t\twidth: 100px;\n' +
							'\t\t\theight: 100px;\n' +
							'\t\t\tmargin: 10px 10px 10px 10px;\n' +
						'\t\t}\n' +
						'\t\t. > Wizard::currentStep > WizardBody[isDisabled(.)] {\n' +
							'\t\t\tdisplay: none;\n' +
							'\t\t\tposition: absolute;\n' +
							'\t\t\twidth: 100px;\n' +
							'\t\t\theight: 100px;\n' +
							'\t\t\tmargin: 10px 10px 10px 10px;\n' +
						'\t\t}\n' +
					'\t]\n' +
				'}'
			);
		});

		it('should parse rules properly', () => {
			testLayoutDescriptorParsing(
				`import bla from './path';\n` +
				`import {bla1, bla2} from './path';\n` +
				`import bla, {bla1, bla2} from './path';\n` +
				'\n' +
				'Window > Wizard {\n' +
					'\tdisplay: none;\n' +
					'\tposition: absolute;\n' +
					'\twidth: 100px;\n' +
					'\theight: 100px;\n' +
					'\tmargin: 10px 10px 10px 10px;\n' +
					'\t\n' +
					'\t[\n' +
						'\t\t. > Wizard::currentStep > WizardBody[isDisabled(.)][isFirst(., \'string\')]\n' +
						'\t\t\'some text\'\n' +
						'\t\t{\n' +
							'\t\t\tdisplay: none;\n' +
							'\t\t\tposition: absolute;\n' +
							'\t\t\twidth: 100px;\n' +
							'\t\t\theight: 100px;\n' +
							'\t\t\tmargin: 10px 10px 10px 10px;\n' +
						'\t\t}\n' +
						'\t\t. > Wizard::currentStep > WizardBody[isDisabled(.)] {\n' +
							'\t\t\tdisplay: none;\n' +
							'\t\t\tposition: absolute;\n' +
							'\t\t\twidth: 100px;\n' +
							'\t\t\theight: 100px;\n' +
							'\t\t\tmargin: 10px 10px 10px 10px;\n' +
						'\t\t}\n' +
					'\t]\n' +
				'}'
			);
		});
	});
});
