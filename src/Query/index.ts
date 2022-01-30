import { Component, ComponentState } from '../Component/types';
import { GetState, Query } from './types';

export const createQuery = <T extends Component<ComponentState>, State = GetState<T>>(query: T): Query<State> => {
   return {
      execute(world) {
         const components = world.entities.map((entity) => {
            const componentIndex = entity.components.findIndex((component) => component.id === query.id);
            if (componentIndex >= 0) {
               return entity.components[componentIndex];
            }
            return null!;
         });

         return components.filter(Boolean).map((v) => v.state as State);
      },
   };
};
