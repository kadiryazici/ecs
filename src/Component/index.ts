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
   private _defultState = {} as State;

   public id = Symbol('ComponentId');

   constructor(defaultState: () => State = () => ({} as State)) {
      const state = defaultState();
      if (isObject<State>(state)) {
         this._defultState = Object.preventExtensions(state);
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

export function defineComponent<State extends DefaultStateType = DefaultStateType>(
   defaultState: () => State = () => ({} as State),
) {
   return new Component(defaultState);
}
