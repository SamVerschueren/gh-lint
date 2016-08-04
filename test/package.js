import path from 'path';
import test from 'ava';
import {lint as m} from '../';
import {fix} from './fixtures/utils';

const opts = {
	cwd: 'fixtures/package',
	inherit: false
};

test('no `files` property', async t => {
	t.deepEqual(await m('no-files', opts), [
		{
			ruleId: 'pkg-files',
			severity: 'error',
			message: 'Missing `files` property in `package.json`.',
			file: path.resolve(opts.cwd, 'no-files/package.json')
		}
	]);
});

test('wrong schema', async t => {
	t.deepEqual(await m('wrong-schema', opts), [
		{
			ruleId: 'pkg-schema',
			severity: 'error',
			message: 'Missing required property: version at path \'#/\'',
			file: path.resolve(opts.cwd, 'wrong-schema/package.json')
		}
	]);
});

test('invalid version', async t => {
	t.deepEqual(await m('invalid-version', opts), [
		{
			ruleId: 'valid-version',
			severity: 'error',
			message: 'The specified `version` in package.json is invalid.',
			file: path.resolve(opts.cwd, 'invalid-version/package.json')
		}
	]);
});

test('invalid order', async t => {
	t.deepEqual(fix(await m('property-order', opts)), [
		{
			ruleId: 'pkg-property-order',
			severity: 'error',
			message: 'Property \'name\' should occur before property \'version\'.',
			file: path.resolve(opts.cwd, 'property-order/package.json')
		}
	]);
});

test('invalid main', async t => {
	t.deepEqual(await m('invalid-main', opts), [
		{
			ruleId: 'pkg-main',
			severity: 'error',
			message: 'Main file \'index.js\' does not exist.',
			file: path.resolve(opts.cwd, 'invalid-main/package.json')
		}
	]);
});

test('object repository field', async t => {
	t.deepEqual(fix(await m('shorthand-repo/object', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/object/package.json')
		}
	]);

	t.deepEqual(fix(await m('shorthand-repo/git-object', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/git-object/package.json')
		}
	]);

	t.deepEqual(fix(await m('shorthand-repo/shorthand-object', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/shorthand-object/package.json')
		}
	]);
});

test('string repository field', async t => {
	t.deepEqual(fix(await m('shorthand-repo/string', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/string/package.json')
		}
	]);

	t.deepEqual(fix(await m('shorthand-repo/git-string', opts)), [
		{
			ruleId: 'pkg-shorthand-repository',
			severity: 'error',
			message: 'Use the shorthand notation `SamVerschueren/clinton` for the `repository` field.',
			file: path.resolve(opts.cwd, 'shorthand-repo/git-string/package.json')
		}
	]);

	t.deepEqual(fix(await m('shorthand-repo', opts)), []);
});

test('shorthand bitbucket repository', async t => {
	t.deepEqual(fix(await m('shorthand-repo/bitbucket-string', opts)), []);
	t.deepEqual(fix(await m('shorthand-repo/bitbucket-object', opts)), []);
});
