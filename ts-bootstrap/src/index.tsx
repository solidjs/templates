/* @refresh reload */
import 'bootstrap/scss/bootstrap.scss';

import { render } from 'solid-js/web';

/**
 * This file was taken from the cheatsheet example of bootstrap.
 * You will most likely remove it if using this template.
 */
import './cheatsheet.scss';

import App from './App';

render(() => <App />, document.getElementById('root') as HTMLElement);
