import {expect} from 'chai';
import 'mocha';

import {LayoutSerializer} from './serializer';

import {LayoutParser} from './layout';

function testParsing(selectorString: string, result: string) {
	expect(result).to.equal(selectorString);
}

function testLayoutDescriptorParsing(descriptorString) {
	testParsing(descriptorString, new LayoutSerializer().serializeLayoutDescriptorToString(
		new LayoutParser().parseLayoutDescriptor(descriptorString)
	));
}

describe('Parser', () => {
	describe('parseLayoutDescriptor', () => {
		it('should parse empty descriptor properly', () => {
			testLayoutDescriptorParsing('{}');
		});

		it('should parse layout properties properly', () => {
			testLayoutDescriptorParsing('{\n' +
				'\tdisplay: none;\n' +
				'\tposition: absolute;\n' +
				'\twidth: 100px;\n' +
				'\theight: 100px;\n' +
				'\tmargin: 10px 10px 10px 10px;\n' +
			'}');
		});

		it('should parse layout children properly', () => {
			testLayoutDescriptorParsing('{\n' +
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
			'}');
		});
	});
});
