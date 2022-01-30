import { Entity } from './types';

export const isEntity = (value: unknown): value is Entity => {
   if (typeof value === 'object' && !Array.isArray(value)) {
      return true;
   }
   return false;
};
