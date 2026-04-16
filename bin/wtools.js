#!/usr/bin/env node
import { program } from 'commander';
import version, { meta as versionMeta } from '#commands/version';
import list, { meta as listMeta } from '#commands/list';
import extract, { meta as extractMeta, resolveOutputPath } from '#commands/extract';


program
    .name('wtools')
    .description('A collection of writing tools')
    .usage('<command> [options]')
    .version(version(), versionMeta.flag, versionMeta.description)
    .helpCommand(true)
    .action(() => {
        // Show help if no arguments are passed
        process.stderr.write(program.helpInformation());
        process.exit(0);
    });

program
    .command('list')
    .description(listMeta.description)
    .action(async () => console.log((await list()).join('\n')));

program
    .command('extract')
    .description(extractMeta.description)
    .argument('<paths...>', 'Paths to files to extract tags from')
    .option('-o, --output <name>', 'output filename without extension', 'output')
    .action(async (paths, options) => {
        console.log('Running Extract...');
        const result = await extract(paths, options);
        if (result === null) {
            console.error('Error: Invalid arguments');
            process.exit(1);
        }
        console.log(`saved to ${resolveOutputPath(paths[0], options.output)}`);
    });

program.parse();