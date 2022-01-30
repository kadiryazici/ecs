import { Component, ComponentInstance, ComponentState } from '../Component/types';
import { World } from '../World/types';
import { QueryType } from './constants';

export type GetState<C> = C extends Component<infer State>
   ? State
   : C extends ComponentInstance<infer State2>
   ? State2
   : never;

export interface Query<QueryReturn> {
   exec(world: World): QueryReturn;
   readonly id: symbol;
}

export type QueryModifier = {
   type: QueryType;
   components: Component<ComponentState>[];
};

type GetDefaultState<T> = T extends Component ? T['defaultState'] : never;

export type MapQueryReturn<T extends unknown[]> = T extends [infer First, ...infer Rest]
   ? [GetDefaultState<First>, ...MapQueryReturn<Rest>]
   : [];
