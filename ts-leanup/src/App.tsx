import type { Component } from 'solid-js';
import logo from './assets/solid.logo.svg';

const App: Component = () => {
  return (
    <div class="container font-sans text-center pt-20">
      <h1 class="text-4xl">Hello</h1>
      <div class="w-140 flex gap-10 m-auto">
        <a href="https://www.solidjs.com" target="solid">
          <img class="w-40" src={logo} alt="Logo Solid" />
        </a>
        <a href="https://github.com/antfu/unocss" target="unocss">
          <img class="w-40" src="./assets/unocss.logo.png" alt="Logo UnoCSS" />
        </a>
        <a href="https://leanupjs.org" target="leanup">
          <img class="w-40" src="./assets/leanup.logo.png" alt="Logo leanûp" />
        </a>
      </div>
      <h2 class="text-2xl text-blue-700">Solid ♡ UnoCSS ♡ leanûp</h2>
      <code class="border p-2 border-gray text-lg">npx degit solidjs/templates/ts-leanup my-solid-project</code>
      <h3>
        Stack <small>(preconfigured)</small>
      </h3>
      <ul class="w-30 m-auto text-left">
        <li>Vite | Webpack</li>
        <li>ESLint</li>
        <li>Prettier</li>
        <li>Mocha</li>
        <li>NYC</li>
        <li>Nightwatch</li>
      </ul>
    </div>
  );
};

export default App;
