import {Application} from 'jsr:@oak/oak/application';
import {Router} from 'jsr:@oak/oak/router';

import {addCorsHeaders} from '../_shared/cors.ts';

import * as discover from './handlers/discover.ts';
import * as render from './handlers/render.ts';

const router = new Router();

router.get('/elwood/discover', discover.handler);
router.post('/elwood/render', render.handler);

const app = new Application();

// cors headers
app.use(async (ctx, next) => {
  Object.entries(addCorsHeaders({'Content-Type': 'application/json'})).forEach(
    ([key, value]) => {
      ctx.response.headers.set(key, value);
    },
  );

  await next();
});
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: 3000});
