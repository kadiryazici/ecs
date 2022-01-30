import { expect, it } from 'vitest';
import { createWorld, createEntity, Type } from '../src/lib';

it('should check features of world', () => {
   const Player = createEntity();
   const world = createWorld();

   expect(world.type).toBe(Type.World);
   expect(world.entities).toEqual([]);

   world.insert(Player);
   world.insert(Player);
   expect(world.entities.length).toBe(1);

   world.remove(Player);
   expect(world.entities.length).toBe(0);
});
