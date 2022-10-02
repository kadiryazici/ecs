import { expect, it } from 'vitest';
import { createWorld, createEntity } from '../src/lib';

it('should check features of world', () => {
   const Player = createEntity();
   const world = createWorld();

   expect(world.entities instanceof Set).toEqual(true);
   expect(world.entities.size).toEqual(0);

   world.add(Player);
   world.add(Player);
   expect(world.entities.size).toBe(1);

   expect(world.findEntity(Player.id)).to.be.eq(Player);

   world.remove(Player);
   expect(world.entities.size).toBe(0);
});
