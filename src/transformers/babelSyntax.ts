/**
 * This will be removed in next versions as it is not handled in the babel-loader
 * See: https://github.com/geowarin/friendly-errors-webpack-plugin/issues/2
 */
 const cleanStackTrace = (message) => {
  return message
    .replace(/^\s*at\s.*:\d+:\d+[\s)]*\n/gm, ''); // at ... ...:x:y
}

const cleanMessage = (message) => {
  return message
    // match until the last semicolon followed by a space
    // this should match
    // linux => "(SyntaxError: )Unexpected token (5:11)"
    // windows => "(SyntaxError: C:/projects/index.js: )Unexpected token (5:11)"
    .replace(/^Module build failed.*:\s/, 'Syntax Error: ')
    // remove mini-css-extract-plugin loader tracing errors
    .replace(/^Syntax Error: ModuleBuildError:.*:\s/, '')
    // remove babel extra wording and path
    .replace(/^Syntax Error: SyntaxError: (([A-Z]:)?\/.*:\s)?/, 'Syntax Error: ');
}

const isBabelSyntaxError = (e) => {
  return e.name === 'ModuleBuildError' || e.name === 'ModuleBuildError' &&
    e.message.indexOf('SyntaxError') >= 0;
}

const transformBabelSyntax = (error) => {
  if (isBabelSyntaxError(error)) {
    return Object.assign({}, error, {
      message: cleanStackTrace(cleanMessage(error.message) + '\n'),
      severity: 1000,
      name: 'Syntax Error',
    });
  }

  return error;
}

export { transformBabelSyntax };