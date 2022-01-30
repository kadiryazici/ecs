import { EntityInstance } from './types';

export const isEntity = (value: unknown): value is EntityInstance => {
   if (typeof value === 'object' && !Array.isArray(value)) {
      return true;
   }
   return false;
};
