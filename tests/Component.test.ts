import { expect, it } from 'vitest';
import { defineComponent, Component } from '../src/lib';

it('Should check a component is a component', () => {
   const Velocity = defineComponent();

   expect(Velocity instanceof Component).toBe(true);

   const instance = Velocity.create({});
   expect(instance.state).toEqual({});
});

it('Should check component state', () => {
   const Position = defineComponent(() => ({
      x: 0,
      y: 0,
   }));

   const instance1 = Position.create();
   expect(instance1.state).toEqual({ x: 0, y: 0 });

   instance1.state.x = 20;
   expect(instance1.state.x).toBe(20);

   const instance2 = Position.create({ y: 55 });
   expect(instance2.state).toEqual({ x: 0, y: 55 });
});
