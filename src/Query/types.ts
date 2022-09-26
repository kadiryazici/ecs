import { Component } from '../Component';
import { Modifier } from './constants';
import type { EntityId } from '../Entity';

export type QueryComponents = [Component | typeof EntityId, ...(Component | typeof EntityId)[]];

export type QueryModifier = {
   type: Modifier;
   components: Component[];
};

type GetDefaultState<T> = T extends Component<infer State> ? State : T extends typeof EntityId ? T : never;

export type MapQueryReturn<T extends unknown[]> = T extends [infer First, ...infer Rest]
   ? [GetDefaultState<First>, ...MapQueryReturn<Rest>]
   : [];
