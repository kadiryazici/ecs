# 1.1.1
  - Added `Optional` query modifier for query components.
  - Added `findEntity` method to `World`.

<br>

# 1.1.0
  - ### Breaking Changes
    - Now `defineComponent` accepts a function that returns default state to prevent reference issues. 
    
      `defineComponent(() => ({}))` 

<br>

# 1.0.0
- defineComponent, createEntity, createWorld and createQueries are based on classes not composition.