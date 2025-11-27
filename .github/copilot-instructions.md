<!-- Auto-generated guidance for AI coding agents working on this repo. -->

# Copilot / AI Agent Instructions — 3d-modeling

Purpose: provide quick, actionable guidance so an AI can be immediately productive in this repository.

- **Big picture**: This is a TypeScript framework for defining 3D models and converting them to STL via JSCAD.

  - Key layers: `src/modeling` (domain model, primitives, operations, transforms), `src/modelParser/jscad` (converts domain models to JSCAD `Geom3`), `src/models` (concrete model implementations and example instances).
    - Domain specific models should be independent of JSCAD; the conversion layer in `modelParser/jscad` handles mapping to JSCAD types.
  - Parsing/DSL: `src/expressionParser` (ANTLR grammar `DimensionScript.g4`) and `src/dimensionParser` (builds dimension definitions and input parsing).

- **Common developer workflows / commands**

  - Install: `npm ci` (postinstall runs grammar compilation)
  - Compile grammar: `npm run compile:grammar` (uses `antlr4ts` to generate parser files under `src/expressionParser/compiled`)
  - Build a single model (creates STL): `npm run build:model src/models/<path-to-model-instance.ts>` (uses `ts-node`/`nodemon` and the `src/scripts/buildModel` script)
  - TypeScript compile (for tests or static checks): `npx tsc -p tsconfig.json` (outputs to `build/src` per `tsconfig.json`)
  - Run tests: first compile with `npx tsc -p tsconfig.json`, then `npm test` (mocha runs against `build/src/tests/**/*.test.js`)
  - Formatting: use `npm run format` to apply Prettier formatting and `npm run format:check` to verify formatting in CI.

- **Project-specific conventions & patterns**

  - Models: create classes that extend `Model3D` or `ModelCollection3D` from `src/modeling`. See `src/models/examples/widget/widget.ts`.
  - Model instances: a file exporting a default object of keyed `Model3D` or `ModelCollection3D` instances (used by `build:model`). See `src/models/examples/widget/widgetInstance.ts`.
  - Parsing grammar: changes to `src/expressionParser/DimensionScript.g4` must be followed by `npm run compile:grammar`.
  - Model → JSCAD conversion: `src/modelParser/jscad/index.ts` maps domain classes (e.g., `RectangularPrism`, `Cylinder`, `ExtrudedPolygon`, `Text3D`) to JSCAD primitives. It uses `instanceof` checks and throws on unhandled types — follow that pattern when adding new primitives or operations.
  - Transform application: transforms are represented as `transformStates` and are applied by mapping to functions then reducing. Preserve this functional transformation pattern for consistency.

- **AI Codegen Rules**

  - Avoid emitting `as` type casts.
    - Do not use `as` (for example `const baz = foo as Bar`) to silence type errors. Prefer:
      - put the type after the variable name (for example `const baz: Bar = foo`),
      - refine types with `instanceof` or custom type guards (type predicates),
      - add narrow, well-typed helper functions or overloaded signatures,
      - adjust interfaces/return types so the compiler understands the shape,
      - use explicit conversions (e.g., parse/construct) instead of casting.
    - Avoid `as any` or `as unknown` except in rare scaffolding scripts; if used, include a short comment explaining why and add a TODO to remove the cast.
    - Example: replace `const p = maybePoint as Vec2[]` with a runtime guard:
      ```ts
      function isVec2Array(v: unknown): v is Vec2[] {
        /* check shape */
      }
      if (!isVec2Array(maybePoint)) throw new Error('unexpected');
      const p = maybePoint; // now typed
      ```
  - Avoid using abbreviations or single letters for names, but don't make names too verbose either.

- **Integration points & external deps**

  - JSCAD: `@jscad/modeling` and `@jscad/cli` are used for geometry construction and STL output (`Geom3`, `geom2`, `path2`, `extrudeLinear`, etc.). Keep type returns compatible with `Geom3` where expected.
  - ANTLR: `antlr4ts` and `antlr4ts-cli` generate the parser used by the expression/dimension parsers.

- **When changing code, be cautious**

  - Tests run against compiled JS in `build/src`. Always run `npx tsc -p tsconfig.json` before `npm test`.
  - `npm run compile:grammar` is required after edits to `DimensionScript.g4` — otherwise parsers will be inconsistent.
  - Keep modifications minimal and fix root causes. Many files rely on the class hierarchy in `src/modeling`; avoid renaming or reshaping exported classes without updating all usages.

- **Files to inspect for context/examples**
  - `src/modeling/*` — core domain classes and operations
  - `src/modelParser/jscad/index.ts` — canonical model→JSCAD translation logic
  - `src/models/examples` — example models and instance files
  - `src/expressionParser/DimensionScript.g4` and `src/expressionParser/*` — grammar and parser code
  - `src/dimensionParser/*` — dimension definition builders and parsers
  - `src/scripts/buildModel.ts` — entrypoint used by `npm run build:model`

If anything here is unclear or you'd like more granular guidance (for example: adding a new primitive, updating the grammar, or running CI/test matrix), tell me which area to expand and I'll iterate.
