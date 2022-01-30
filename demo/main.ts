import { defineComponent } from '../src/Component';
import { createEntity } from '../src/Entity';
import { With } from '../src/lib';
import { createQuery } from '../src/Query';
import { createWorld } from '../src/World';

// Lets get our canvas and context.
const canvas = document.querySelector('canvas')!;
canvas.width = window.innerWidth;
canvas.height = (window.innerWidth / 16) * 9;

document.body.style.margin = '0';

const context = canvas.getContext('2d')!;

let oldTime = Date.now();
let delta = 0;

// Create components we need.
const Position = defineComponent({
   x: 0,
   y: 0,
});

const Velocity = defineComponent({
   x: 0,
   y: 0,
});

const Bounds = defineComponent({
   width: 0,
   height: 0,
});

const Color = defineComponent({
   value: '#000',
});

// A helper function to create a box.
const createBox = (x = 0, y = 0, gravity = 250) =>
   createEntity([
      Velocity.new({ y: gravity }),
      Position.new({ x, y }),
      Bounds.new({
         width: 50,
         height: 50,
      }),
      Color.new({
         value: 'rgb(152, 93, 115)',
      }),
   ]);

const world = createWorld();

world.insert(createBox(50, 75));
world.insert(createBox(150, 125, -250));

// A MovementSystem that updates positions by velocity.
const MovementQuery = createQuery([Position, Velocity], With(Bounds));
const movementSystem = () => {
   const query = MovementQuery.exec(world);

   for (const [position, velocity] of query) {
      position.x += velocity.x * delta;
      position.y += velocity.y * delta;
   }
};

// A Draw system that draws boxes to canvas.
const DrawQuery = createQuery([Position, Bounds, Color]);
const drawSystem = () => {
   context.fillStyle = 'rgb(22, 22, 22)';
   context.fillRect(0, 0, canvas.width, canvas.height);

   const query = DrawQuery.exec(world);

   for (const [pos, bounds, color] of query) {
      context.fillStyle = color.value;
      context.fillRect(pos.x, pos.y, bounds.width, bounds.height);
   }
};

const PositionsQuery = createQuery([Position, Bounds, Velocity]);
const outOfScreenSystem = () => {
   const query = PositionsQuery.exec(world);

   for (const [pos, bounds, vel] of query) {
      if (vel.x > 0 && pos.x > canvas.width) {
         pos.x = -bounds.width;
      } else if (vel.x < 0 && pos.x < bounds.width) {
         pos.x = canvas.width + bounds.width;
      }

      if (vel.y > 0 && pos.y > canvas.height) {
         pos.y = -bounds.height;
      } else if (vel.y < 0 && pos.y < -bounds.height) {
         pos.y = canvas.height + bounds.height;
      }
   }
};

canvas.addEventListener('mousedown', (e) => {
   const query = PositionsQuery.exec(world);

   const { top, left } = canvas.getBoundingClientRect();

   const x = e.clientX - left;
   const y = e.clientY - top;

   for (const [pos, bounds, vel] of query) {
      if (
         x >= pos.x && //
         x <= pos.x + bounds.width &&
         y >= pos.y &&
         y <= pos.y + bounds.height
      ) {
         vel.y *= -1;
      }
   }
});

window.addEventListener('resize', () => {
   canvas.width = window.innerWidth;
   canvas.height = (window.innerWidth / 16) * 9;
});

const update = () => {
   requestAnimationFrame(update);

   const now = Date.now();
   delta = (now - oldTime) / 1000;
   oldTime = now;

   movementSystem();
   outOfScreenSystem();
   drawSystem();
};

requestAnimationFrame(update);
