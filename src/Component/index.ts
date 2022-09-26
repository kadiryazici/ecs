import { mergeComponentState } from './helpers';

function isObject<Obj = object>(value: unknown): value is Obj {
   return Object.prototype.toString.call(value).slice(8, -1) === 'Object';
}

export type DefaultStateType = Record<PropertyKey, unknown>;
export interface ComponentDescriptor<State = DefaultStateType> {
   id: symbol;
   componentId: symbol;
   state: State;
}

export class Component<State extends DefaultStateType = DefaultStateType> {
   private _defultState = Object.preventExtensions({} as State);

   public id = Symbol('ComponentId');

   constructor(defaultState?: State) {
      if (isObject<State>(defaultState)) {
         this._defultState = Object.preventExtensions({ ...defaultState });
      }
   }

   public create(state: Partial<State> = {}) {
      return Object.preventExtensions<ComponentDescriptor<State>>({
         id: Symbol('ComponentDescriptorId'),
         componentId: this.id,
         state: mergeComponentState(this._defultState, state),
      });
   }
}

export function defineComponent<State extends Record<PropertyKey, unknown>>(defaultState?: State) {
   return new Component(defaultState);
}
