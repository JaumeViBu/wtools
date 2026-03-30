#!/usr/bin/env node
import { program } from 'commander';
import version, { meta as versionMeta } from '#commands/version';
import list, { meta as listMeta } from '#commands/list';


program
    .name('wtools')
    .description('A collection of writing tools')
    .usage('<command> [options]')
    .version(version(), versionMeta.flag, versionMeta.description)
    .action(() => {
        // Show help if no arguments are passed
        process.stdout.write(program.helpInformation());
        process.exit(0);
    });;

program
    .command('list')
    .description(listMeta.description)
    .action(async () => console.log((await list()).join('\n')));

program.parse();