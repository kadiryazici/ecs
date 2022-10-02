import { Component } from '../Component';
import { Modifier, OptionalSym } from './constants';
import { EntityId } from '../Entity';

type QueryComponents = Component | typeof EntityId | OptionalModifier;
export type QueryComponentsTuple = [QueryComponents, ...QueryComponents[]];

export type QueryModifier = {
   type: Modifier;
   components: Component[];
};

export type OptionalModifier<C = Component> = {
   type: typeof OptionalSym;
   value: C;
};

type GetDefaultState<T> = T extends Component<infer State>
   ? State
   : T extends typeof EntityId
   ? typeof EntityId
   : T extends OptionalModifier<infer C>
   ? GetDefaultState<C> | undefined
   : never;

export type MapQueryReturn<T extends unknown[]> = T extends [infer First, ...infer Rest]
   ? [GetDefaultState<First>, ...MapQueryReturn<Rest>]
   : [];
