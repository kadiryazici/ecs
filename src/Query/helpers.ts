import { Component } from '../Component';
import { Modifier } from './constants';
import { QueryModifier } from './types';

export function With(...components: Component[]): QueryModifier {
   return {
      type: Modifier.With,
      components,
   };
}

export function Without(...components: Component[]): QueryModifier {
   return {
      type: Modifier.Without,
      components,
   };
}
