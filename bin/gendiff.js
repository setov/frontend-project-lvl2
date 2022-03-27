#!/usr/bin/env node

import { Command } from 'commander/esm.mjs';
import gendiff from '../index.js';

const program = new Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2, option) => {
    const { format } = option;
    console.log(gendiff(filepath1, filepath2, format));
  });

program.parse();
