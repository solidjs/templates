import { createApp } from '@reactivescript/runtime';
import './App.css';
// @ts-expect-error rx-tsc's projection of App.rx has no default export yet
import main from './App.rx';

const app = createApp({ root: document.getElementById('app')! });
app.mount(main(app));
