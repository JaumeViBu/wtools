#!/usr/bin/env node
import { program } from 'commander';
import version, {meta as versionMeta} from '../src/commands/version.js';


program
    .name('wtools')
    .description('A collection of dev tools')
    .usage('<command> [options]')
    .version(version(), versionMeta.flag, versionMeta.description);

program.parse();