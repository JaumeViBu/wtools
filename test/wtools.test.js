import { execSync } from 'child_process';
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';

describe('wtools', () => {
    it('should run without crashing', () => {
        expect(() => execSync('node bin/wtools.js')).not.toThrow();
        expect(() => execSync('node bin/wtools.js -V')).not.toThrow();
        expect(() => execSync('node bin/wtools.js --version')).not.toThrow();
        expect(() => execSync('node bin/wtools.js list')).not.toThrow();
        expect(() => execSync('node bin/wtools.js help')).not.toThrow();
        expect(() => execSync('node bin/wtools.js -h')).not.toThrow();
    });

    it('should crash if given unkown arguments', () => {
        expect(() => execSync('node bin/wtools.js unkown')).toThrow();
        expect(() => execSync('node bin/wtools.js -U')).toThrow();
        expect(() => execSync('node bin/wtools.js --unkown')).toThrow();
    });

    it('should show help when called with no arguments', () => {
        const result = spawnSync('node', ['bin/wtools.js'], { encoding: 'utf8' });
        expect(result.stderr).toContain('Usage:');
    });
});