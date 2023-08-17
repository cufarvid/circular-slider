# circular-slider

Circular Slider written in TypeScript. Check out the [demo](https://cufarvid.github.io/circular-slider/).

## Usage

### Circular Slider

Create a new `CircularSlider` instance:

```typescript
const slider = new CircularSlider({
  container: document.getElementById('app')!,
  label: 'Slider',
  color: 'red',
  radius: 100,
  min: 0,
  max: 100,
  step: 1,
  onChange: ({ value }) => {
    console.log(value);
  },
});
```

### Stacked Circular Slider

Create a new `StackedCircularSlider` instance:

```typescript
const slider = new StackedCircularSlider({
  container: document.getElementById('app')!,
  sliders: [
    {
      label: 'Inner Slider',
      color: 'red',
      radius: 50,
      min: 0,
      max: 100,
      step: 1,
      onChange: ({ value }) => {
        console.log(value);
      },
    },
    {
      label: 'Outer Slider',
      color: 'blue',
      radius: 100,
      min: 0,
      max: 1000,
      step: 10,
      onChange: ({ value }) => {
        console.log(value);
      },
    },
  ],
});
```

## Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```
