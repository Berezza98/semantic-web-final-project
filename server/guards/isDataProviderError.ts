import { DataProviderError } from '../interfaces';

export const isDataProviderError = (obj: any): obj is DataProviderError => {
  return 'status' in obj && 'message' in obj;
};
