import { beforeEach, expect, it } from 'vitest';
import { createQuery, createEntity, createWorld, defineComponent, With, Without } from '../src/lib';

const Velocity = defineComponent(() => ({
   x: 0,
   y: 0,
}));

const RigidBody = defineComponent();
const KinematicBody = defineComponent();

const Transform = defineComponent(() => ({
   x: 0,
   y: 0,
   z: 0,
}));

const Name = defineComponent(() => ({
   value: '',
}));

const Shape = defineComponent(() => ({
   value: 'rectangle' as 'rectangle' | 'circle',
}));

const world = createWorld();

const insertDefaultEntities = () => {
   world.add(
      createEntity()
         .add(KinematicBody.create())
         .add(
            Name.create({
               value: 'Player',
            }),
         ),
   );

   world.add(
      createEntity()
         .add(
            Transform.create({
               x: 5,
            }),
         )
         .add(
            Name.create({
               value: 'Player',
            }),
         ),
   );

   world.add(
      createEntity()
         .add(KinematicBody.create())
         .add(Transform.create({ y: 4 }))
         .add(Name.create({ value: 'Enemy' })),
   );
};

beforeEach(() => {
   world.clear();
});

it('should run simple query', () => {
   world.add(
      createEntity() //
         .add(Shape.create())
         .add(Velocity.create())
         .add(KinematicBody.create()),
   );

   world.add(
      createEntity()
         .add(Shape.create({ value: 'circle' }))
         .add(Velocity.create())
         .add(RigidBody.create())
         .add(Transform.create()),
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

   world.add(
      createEntity()
         .add(KinematicBody.create())
         .add(Transform.create({ y: 4 }))
         .add(Name.create({ value: 'Dude' })),
   );

   const Query = createQuery([Name], With(KinematicBody), Without(Transform));
   const query = Query.exec(world);

   expect(query).length(1);
   expect(query).toEqual([[{ value: 'Player' }]]);
});
