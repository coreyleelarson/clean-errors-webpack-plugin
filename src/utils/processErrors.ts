import ErrorStackParser from 'error-stack-parser';
import { WebpackError } from 'webpack';
import RequestShortener from 'webpack/lib/RequestShortener';

const requestShortener = new RequestShortener(process.cwd());

export const extractErrorFromWebpack = (error: WebpackError) => ({
  file: getFile(error),
  message: error.message,
  name: error.name,
  originalStack: getOriginalErrorStack(error),
  severity: 0,
});

const getFile = (error: WebpackError) => {
  if (error.file) return error.file;
  return error?.module?.readableIdentifier(requestShortener);
}

const getOriginalErrorStack = (error: WebpackError) => {
  if (error.stack) return ErrorStackParser.parse(error);
  return [];
}