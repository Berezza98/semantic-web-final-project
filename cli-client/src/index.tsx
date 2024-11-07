import { render } from 'ink';
import { App } from './App.js';
import { RouterContext } from './contexts/RouterContext.js';

function main() {
  render(
    <RouterContext>
      <App />
    </RouterContext>
  );
}

main();