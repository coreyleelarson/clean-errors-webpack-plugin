const plugin = { name: 'CleanErrorsPlugin' };

export interface CleanErrorsPluginOptions {
  clearConsole?: boolean;
}

export class CleanErrorsPlugin {
  options: CleanErrorsPluginOptions = {};

  constructor(options: CleanErrorsPluginOptions = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.invalid.tap(plugin, this.invalid);
    compiler.hooks.done.tap(plugin, this.done);
  }

  clear = () => {
    if (this.options.clearConsole) {
      console.clear();
    }
  }

  invalid = () => {
    this.clear();
    console.log('Compiling...');
  }

  done = () => {
    this.clear();
    console.log('Done...');
  }
}