import { transformErrors } from './utils/transformErrors';
import chalk from 'chalk';
import ora from 'ora';
import { Stats, WebpackError } from "webpack";

// Transformers.
import { transformBabelSyntax } from './transformers';

const plugin = { name: 'CleanErrorsPlugin' };
const transformers = [transformBabelSyntax];

export interface CleanErrorsPluginOptions {
  clear?: boolean;
  messages?: string[],
  notes?: string[],
}

export class CleanErrorsPlugin {
  options: CleanErrorsPluginOptions = {};
  spinner = undefined;

  constructor(options: CleanErrorsPluginOptions = {}) {
    this.options = options;
  }

  apply = (compiler): void => {
    compiler.hooks.invalid.tap(plugin, this.invalid);
    compiler.hooks.done.tap(plugin, this.done);
    this.init();
  }

  clear = (): void => {
    if (this.options.clear) {
      console.clear();
    }
  }

  init = () => {
    this.clear();
    this.spinner = ora(chalk.cyan('Compiling')).start();
  }

  invalid = (): void => {
    this.init();
  }

  done = (stats: Stats): void => {
    if (stats.hasWarnings()) {
      const warnings = transformErrors(stats.compilation.warnings, transformers);
      this.spinner.warn(chalk.yellow(`Compiled with ${warnings?.length} warning${warnings?.length === 1 ? '' : 's'}.`));
      console.log('');
      for (const warning of warnings) {
        console.log(`Warning in ${warning.file}`);
        console.log('');
        console.log(warning.message);
        console.log('');
      }
    } else if (stats.hasErrors()) {
      const errors = transformErrors(stats.compilation.errors, transformers);
      this.spinner.fail(chalk.red(`Compiled with ${errors?.length} error${errors?.length === 1 ? '' : 's'}.`));
      console.log('');
      for (const error of errors) {
        console.log(`Error in ${error.file}`);
        console.log('');
        console.log(error.message);
        console.log('');
      }
    } else {
      const time = this.getTimeFromStats(stats);
      this.spinner.succeed(chalk.green(`Compiled successfully in ${time}`));

      if (this.options.messages?.length) {
        console.log('');
        for (const message of this.options.messages) {
          console.log(chalk.bold(message));
        }
      }

      if (this.options.notes?.length) {
        console.log('');
        for (const notes of this.options.notes) {
          console.log(notes);
        }
      }

      console.log('');
    }
  }

  getTimeFromStats = (stats: Stats): string => {
    const time = stats.compilation.endTime - stats.compilation.startTime;
    if (time >= 1000) return `${(time / 1000).toFixed(2)}s`;
    return `${time}ms`;
  }
}