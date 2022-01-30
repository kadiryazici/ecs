import { Component } from '../Component/types';
import { Entity } from '../Entity/types';
import { QueryType } from './constants';
import { QueryModifier } from './types';

export function With(...components: Component[]): QueryModifier {
   return {
      type: QueryType.With,
      components,
   };
}

export function Without(...components: Component[]): QueryModifier {
   return {
      type: QueryType.Without,
      components,
   };
}

export const findComponentInEntity = (entity: Entity, component: Component) => {
   const index = entity.components.findIndex((c) => c.id === component.id);
   if (index >= 0) {
      return entity.components[index];
   }
   return null;
};
