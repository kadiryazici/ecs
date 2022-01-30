import { Type } from '../Type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentState = Record<string, any>;

export interface ComponentInstance<State = ComponentState> {
   id: symbol;
   type: typeof Type.Component;
   state: State;
}

export interface Component<State = ComponentState> {
   ['new'](state?: Partial<State>): ComponentInstance<State>;
   readonly id: symbol;
   readonly type: typeof Type.Component;
   readonly defaultState: State;
}
