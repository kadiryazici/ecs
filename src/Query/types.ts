import { Component, ComponentState } from '../Component/types';
import { World } from '../World/types';

export type GetState<C> = C extends Component<infer S> ? S : ComponentState;

export interface Query<State> {
   execute(world: World): State[];
}
