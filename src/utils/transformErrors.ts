import { extractErrorFromWebpack } from './';

export const transformErrors = (errors, transformers) => {
  const transform = (error, transformer) => transformer(error);
  const applyTransformations = (error) => transformers.reduce(transform, error);
  return errors.map(extractErrorFromWebpack).map(applyTransformations);
}