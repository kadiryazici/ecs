import exp from 'constants';
import { beforeEach, expect, it } from 'vitest';
import { createQuery, createEntity, createWorld, defineComponent, With, Without } from '../src/lib';

const Velocity = defineComponent({
   x: 0,
   y: 0,
});

const RigidBody = defineComponent({});

const KinematicBody = defineComponent({});

const Transform = defineComponent({
   x: 0,
   y: 0,
   z: 0,
});

const Name = defineComponent({
   value: '',
});

const Shape = defineComponent({
   value: 'rectangle' as 'rectangle' | 'circle',
});

const world = createWorld();

const insertDefaultEntities = () => {
   world.insert(
      createEntity([
         KinematicBody.new(),
         Name.new({
            value: 'Player',
         }),
      ]),
   );

   world.insert(
      createEntity([
         Transform.new({
            x: 5,
         }),
         Name.new({
            value: 'Player',
         }),
      ]),
   );

   world.insert(
      createEntity([
         KinematicBody.new(),
         Transform.new({
            y: 4,
         }),
         Name.new({
            value: 'Enemy',
         }),
      ]),
   );
};

beforeEach(() => {
   world.clear();
});

it('should run simple query', () => {
   world.insert(
      createEntity([
         Shape.new(), //
         Velocity.new(),
         KinematicBody.new(),
      ]),
   );

   world.insert(
      createEntity([
         Shape.new({
            value: 'circle',
         }), //
         Velocity.new(),
         RigidBody.new(),
         Transform.new(),
      ]),
   );

   const ShapeQuery = createQuery([Shape]);

   const query = ShapeQuery.exec(world);
   expect(query.length).toBe(2);
   expect(query).toEqual([[{ value: 'rectangle' }], [{ value: 'circle' }]]);
});

it('should query multiple components', () => {
   insertDefaultEntities();

   const TransformNameQuery = createQuery([Name, Transform]);
   const query = TransformNameQuery.exec(world);

   expect(query.length).toBe(2);
   expect(query.every((v) => v.length === 2)).toBe(true);
   expect(query).toEqual([
      [{ value: 'Player' }, { x: 5, y: 0, z: 0 }],
      [{ value: 'Enemy' }, { x: 0, y: 4, z: 0 }],
   ]);
});

it('should query with `With` modifier', () => {
   insertDefaultEntities();

   const Query = createQuery([Name, Transform], With(KinematicBody));
   const query = Query.exec(world);

   expect(query.length).toBe(1);
   expect(query).toEqual([[{ value: 'Enemy' }, { x: 0, y: 4, z: 0 }]]);
});

it('should query with `Without` modifier', () => {
   insertDefaultEntities();

   const Query = createQuery([Name, Transform], Without(KinematicBody));
   const query = Query.exec(world);

   expect(query.length).toBe(1);
   expect(query).toEqual([[{ value: 'Player' }, { x: 5, y: 0, z: 0 }]]);
});

it('should mix With and Without modifiers', () => {
   insertDefaultEntities();

   world.insert(
      createEntity([
         KinematicBody.new(),
         Transform.new({
            y: 4,
         }),
         Name.new({
            value: 'Dude',
         }),
      ]),
   );

   const Query = createQuery([Name], With(KinematicBody), Without(Transform));
   const query = Query.exec(world);

   expect(query).length(1);
   expect(query).toEqual([[{ value: 'Player' }]]);
});
