import { Component } from '../Component';
import { Modifier, OptionalSym } from './constants';
import { OptionalModifier, QueryModifier } from './types';

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

export function Optional<C extends Component>(component: C): OptionalModifier<C> {
   return {
      type: OptionalSym,
      value: component,
   };
}
