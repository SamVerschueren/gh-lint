import path from 'path';
import test from 'ava';
import {lint as m} from '../';
import {assign, fix} from './fixtures/utils';

const opts = {
	cwd: 'test/fixtures/ava',
	inherit: false
};

const inherit = assign(opts);

test('no AVA dependency', async t => {
	t.deepEqual(await m('no-dependency', opts), [
		{
			ruleId: 'ava',
			severity: 'error',
			message: 'AVA is not installed as devDependency.',
			file: path.resolve(opts.cwd, 'no-dependency/package.json')
		}
	]);
});

test('wrong version', async t => {
	t.deepEqual(await m('.', inherit({rules: {ava: ['error', '0.15.2']}})), [
		{
			ruleId: 'ava',
			severity: 'error',
			message: 'Expected version \'0.15.2\' but found \'0.15.1\'.',
			file: path.resolve(opts.cwd, 'package.json')
		}
	]);

	t.deepEqual(await m('.', inherit({rules: {ava: ['error', '0.16.0']}})), [
		{
			ruleId: 'ava',
			severity: 'error',
			message: 'Expected version \'0.16.0\' but found \'0.15.1\'.',
			file: path.resolve(opts.cwd, 'package.json')
		}
	]);
});

test('unicorn version', async t => {
	t.is((await m('unicorn', inherit({rules: {ava: ['error', '*']}}))).length, 0);

	t.deepEqual(await m('.', inherit({rules: {ava: ['error', '*']}})), [
		{
			ruleId: 'ava',
			severity: 'error',
			message: 'Expected unicorn version \'*\' but found \'0.15.1\'.',
			file: path.resolve(opts.cwd, 'package.json')
		}
	]);
});

test('test script', async t => {
	t.deepEqual(fix(await m('no-script', opts)), [
		{
			ruleId: 'ava',
			severity: 'error',
			message: 'AVA is not used in the test script.',
			file: path.resolve(opts.cwd, 'no-script/package.json')
		}
	]);
});

test('cli config', async t => {
	t.deepEqual(fix(await m('cli-config', opts)), [
		{
			ruleId: 'ava',
			severity: 'error',
			message: 'Specify AVA config in `package.json` instead of passing it through via the CLI.',
			file: path.resolve(opts.cwd, 'cli-config/package.json')
		}
	]);
});
