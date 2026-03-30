#!/usr/bin/env node
import { program } from 'commander';
import version from '../src/commands/version.js';

program.version(version(), '-V, --version', 'Print the current version');