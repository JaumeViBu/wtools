#!/usr/bin/env node
import { program } from 'commander';
import version, { meta as versionMeta } from '#commands/version';
import list, { meta as listMeta } from '#commands/list';


program
    .name('wtools')
    .description('A collection of dev tools')
    .usage('<command> [options]')
    .version(version(), versionMeta.flag, versionMeta.description);

program
    .command('list')
    .description(listMeta.description)
    .action(async () => console.log((await list()).join('\n')));

program.parse();

// Show help if no arguments are passed
if (!process.argv.slice(2).length) {
    program.outputHelp();
}