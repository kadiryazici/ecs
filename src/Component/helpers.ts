import { Type } from '../Type';
import { ComponentInstance, ComponentState } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isComponent = <State = ComponentState>(value: any): value is ComponentInstance<State> => {
   if (typeof value !== 'object' || Array.isArray(value)) return false;

   return value.type === Type.Component;
};

export const mergeComponentState = <State extends ComponentState>(
   defaultState: State,
   state: Partial<State> = {},
): State => {
   const def = { ...defaultState };

   for (const key of Object.keys(state)) {
      if (Object.prototype.hasOwnProperty.call(def, key)) {
         // @ts-expect-error we cannot type keys.
         def[key] = state[key];
      }
   }

   return def;
};
