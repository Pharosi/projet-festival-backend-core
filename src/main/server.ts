import { createApp } from './app.js';
import { createDependencies } from './container.js';

const port = Number(process.env.PORT ?? 3000);
const app = createApp(createDependencies());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
