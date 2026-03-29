import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        alias: {
            '#commands/': new URL('./src/commands/', import.meta.url).pathname,
            '#utils/': new URL('./src/utils/', import.meta.url).pathname,
            '#bin/': new URL('./bin/', import.meta.url).pathname,
            '#root/': new URL('./package.json', import.meta.url).pathname,
        }
    }
});