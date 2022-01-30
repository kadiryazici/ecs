import { defineComponent } from './Component';
import { createEntity } from './Entity';
import { createQuery } from './Query';
import { With } from './Query/helpers';
import { createWorld } from './World';

const Velocity = defineComponent({
   x: 0,
   y: 0,
});

const Position = defineComponent({
   x: 0,
   y: 0,
});

const Name = defineComponent({
   value: '',
});

const Bounds = defineComponent({
   width: 0,
   height: 0,
});

const Color = defineComponent({
   value: [0, 0, 0, 0] as [number, number, number, number],
});

const createBox = () =>
   createEntity([
      Name.new({
         value: 'Box',
      }),
      Velocity.new({
         x: 5,
         y: 0,
      }),
      Bounds.new({
         width: 50,
         height: 50,
      }),
      Color.new({
         value: [75, 28, 152, 1],
      }),
      Position.new({
         x: 25,
         y: 25,
      }),
   ]);

const createRectangle = () =>
   createEntity([
      Name.new({
         value: 'Rectangle',
      }),
      Velocity.new({
         x: 5,
         y: 0,
      }),
      Bounds.new({
         width: 50,
         height: 50,
      }),
      Color.new({
         value: [75, 28, 152, 1],
      }),
      Position.new({
         x: 25,
         y: 25,
      }),
   ]);

const world = createWorld();
world.insert(createBox());
world.insert(createBox());
world.insert(createBox());
world.insert(createRectangle());

const MovementQuery = createQuery([Velocity, Position]);
const movementSystem = () => {
   const query = MovementQuery.exec(world);

   for (const [vel, pos] of query) {
      pos.x += vel.x;
      pos.y += vel.y;
   }
};

const DrawQuery = createQuery([Bounds, Color, Position]);
const drawSystem = (ctx: CanvasRenderingContext2D) => {
   const query = DrawQuery.exec(world);

   for (const [bounds, color, pos] of query) {
      ctx.fillStyle = `rgba(${color.value.join(',')})`;
      ctx.fillRect(pos.x, pos.y, bounds.width, bounds.height);
   }
};

const drawNamesOfBoxesOnScreenQuery = createQuery([Name], With(Position, Bounds));
const drawNamesOfBoxesOnScreenSystem = (ctx: CanvasRenderingContext2D) => {
   const query = drawNamesOfBoxesOnScreenQuery.exec(world);

   const x = 15;
   const y = 15;

   query.forEach(([name], index) => {
      ctx.font = '15px Arial';
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fillText(name.value, x, y * index + y);
   });
};

const canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

const context = canvas.getContext('2d')!;

setInterval(() => {
   context.clearRect(0, 0, canvas.width, canvas.height);
   movementSystem();
   drawSystem(context);
   drawNamesOfBoxesOnScreenSystem(context);
}, 1000 / 60);
