import { Type } from '../Type';
import { COMPONENT_STATE_ERROR } from './constants';
import { mergeComponentState } from './helpers';
import { Component, ComponentState } from './types';

export const defineComponent = <State extends ComponentState>(defaultState: State): Component<State> => {
   if (typeof defaultState !== 'object') throw Error(COMPONENT_STATE_ERROR);
   if (Array.isArray(defaultState)) throw Error(COMPONENT_STATE_ERROR);

   const id = Symbol('id');
   const defaultStateClone = { ...defaultState };

   return {
      get id() {
         return id;
      },
      get type() {
         return Type.Component;
      },
      get defaultState() {
         return defaultStateClone;
      },
      new: (state) => {
         const mergedState = mergeComponentState<State>(defaultState, state);

         return {
            state: mergedState,
            get id() {
               return id;
            },
            get type() {
               return Type.Component;
            },
         };
      },
   };
};
