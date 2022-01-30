import { expect, it } from 'vitest';
import { defineComponent, isComponent, Type } from '../src/lib';

it('Should check a component is a component', () => {
   const Velocity = defineComponent({});

   expect(isComponent(Velocity)).toBe(true);
   expect(Velocity.defaultState).toEqual({});
   expect(Velocity.type).toBe(Type.Component);

   const instance = Velocity.new();
   expect(instance.state).toEqual({});
});

it('Should check component state', () => {
   const Position = defineComponent({
      x: 0,
      y: 0,
   });

   expect(Position.defaultState).toEqual({ x: 0, y: 0 });

   const instance1 = Position.new();
   expect(instance1.state).toEqual({ x: 0, y: 0 });

   instance1.state.x = 20;
   expect(instance1.state.x).toBe(20);

   const instance2 = Position.new({ y: 55 });
   expect(instance2.state).toEqual({ x: 0, y: 55 });
   expect(instance2.state).toEqual({ x: 0, y: 55 });
});
