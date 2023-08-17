import './style.css';
import { CircularSliderOptions } from './types.ts';
import { StackedCircularSlider } from './stacked-circular-slider.ts';

(() => {
  const sliders: CircularSliderOptions[] = [
    {
      label: 'Transportation',
      color: 'purple',
      initialValue: 750,
      radius: 160,
      max: 1000,
    },
    {
      label: 'Food',
      color: 'blue',
      initialValue: 650,
      radius: 130,
      max: 1000,
    },
    {
      label: 'Insurance',
      color: 'green',
      initialValue: 500,
      radius: 100,
      max: 1000,
    },
    {
      label: 'Entertainment',
      color: 'orange',
      initialValue: 800,
      radius: 70,
      max: 1000,
    },
    {
      label: 'Health care',
      color: 'red',
      initialValue: 200,
      radius: 40,
      max: 1000,
    },
  ];

  const container = document.getElementById('app');

  if (!container) {
    throw new Error('Container element not found!');
  }

  new StackedCircularSlider({ container, sliders });
})();
