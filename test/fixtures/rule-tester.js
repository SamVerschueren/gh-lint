'use strict';
const lint = require('../../').lint;
const Fixer = require('../../lib/fixer');
const fix = require('./utils').fix;

const testFix = (t, validation, output) => {
	const fixer = new Fixer();

	return fixer.fix(validation).then(result => {
		t.deepEqual(result, output);
	});
};

module.exports = options => {
	options = Object.assign({inherit: false}, options);

	return (t, rule, expectedValidations, expectedFixes) => {
		return lint(rule, options)
			.then(validations => {
				let ret = Promise.resolve();

				if (expectedFixes) {
					const promises = validations.map((x, i) => testFix(t, x, expectedFixes[i]));

					ret = ret.then(() => Promise.all(promises));
				}

				return ret.then(() => validations);
			})
			.then(validations => {
				if (expectedFixes) {
					validations = fix(validations);
				}

				if (expectedValidations) {
					t.deepEqual(validations, expectedValidations);
				}

				return validations;
			});
	};
};
