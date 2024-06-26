import {Application} from 'jsr:@oak/oak/application';
import {Router} from 'jsr:@oak/oak/router';
import {isHttpError} from 'jsr:@oak/commons/http_errors';
import {oakCors} from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import {Status} from 'jsr:@oak/commons/status';

import * as discover from './handlers/discover.ts';
import * as render from './handlers/render.ts';
import * as search from './handlers/search.ts';

console.log('boot');

const router = new Router();

router.get('/elwood/discover', discover.handler);
router.post('/elwood/render', render.handler);
router.post('/elwood/search', search.handler);

router.get('/elwood', ctx => {
  console.log(ctx.request.url);

  ctx.response.status = Status.OK;
  ctx.response.body = 'Elwood is running!';
});

const app = new Application();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      ctx.response.body = {
        code: err.status ?? 500,
        error: err.message,
      };
    } else {
      // rethrow if you can't handle the error
      throw err;
    }
  }
});

// cors headers
app.use(oakCors({origin: true}));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: 0});
