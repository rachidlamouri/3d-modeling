# 3d-Modeling

Framework for defining 3d models. Models can be converted to stl files with jscad.

## Getting Started

```bash
npm ci

npm run compile:grammar

npm run build:model src/models/examples/widget/widgetInstance.ts

# open 'build/src/models/examples/widget/widgetInstance.*.stl' in an stl viewer
```

## Developing a Model

### Models

Make a file that exports a subclass of `Model3D` or `ModelCollection3D`. See `src/models/examples/widget/widget.ts` for an example.

### Model Instances

Make a file with a default export containing keyed `Model3D` or `ModelCollection3D` instances. See `src/models/examples/widget/widgetInstance.ts` for an example.

### Model Development Process

```bash
npm run build:model src/models/<path-to-model.ts>

# open build/src/models/path_to_my_model_instance.*.stl in an stl viewer
```
