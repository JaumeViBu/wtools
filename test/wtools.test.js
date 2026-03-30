import { execSync } from 'child_process';
import { describe, it, expect } from 'vitest';

describe('wtools', () => {
    it('should run without crashing', () => {
        expect(() => execSync('node bin/wtools.js -V')).not.toThrow();
    });
    it('should run without crashing', () => {
        expect(() => execSync('node bin/wtools.js --version')).not.toThrow();
    });
    it('should show help when called with no arguments', () => {
        const output = execSync('node bin/wtools.js').toString();
        expect(output).toContain('Usage:');
    });
});