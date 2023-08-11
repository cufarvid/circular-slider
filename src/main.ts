import { CircularSlider } from './circular-slider';
import './style.css';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Container element not found!');
}

new CircularSlider({ container, label: 'Test' });
