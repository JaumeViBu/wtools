import { execSync } from 'child_process';
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';

describe('wtools', () => {
    it('should run without crashing', () => {
        expect(() => execSync('node bin/wtools.js', { stdio: 'ignore' })).not.toThrow();
        expect(() => execSync('node bin/wtools.js -V', { stdio: 'ignore' })).not.toThrow();
        expect(() => execSync('node bin/wtools.js --version', { stdio: 'ignore' })).not.toThrow();
        expect(() => execSync('node bin/wtools.js list', { stdio: 'ignore' })).not.toThrow();
        expect(() => execSync('node bin/wtools.js help', { stdio: 'ignore' })).not.toThrow();
        expect(() => execSync('node bin/wtools.js -h', { stdio: 'ignore' })).not.toThrow();
    });

    it('should crash if given unknown arguments', () => {
        expect(() => execSync('node bin/wtools.js unknown', { stdio: 'ignore' })).toThrow();
        expect(() => execSync('node bin/wtools.js -U', { stdio: 'ignore' })).toThrow();
        expect(() => execSync('node bin/wtools.js --unknown', { stdio: 'ignore' })).toThrow();
    });

    it('should show help when called with no arguments', () => {
        const result = spawnSync('node', ['bin/wtools.js'], { encoding: 'utf8' });
        expect(result.stderr).toContain('Usage:');
    });
});