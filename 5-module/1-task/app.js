const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const users = new Set();

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve) => {
    users.add(resolve);

    ctx.req.on('aborted', () => {
      users.delete(resolve);
      resolve();
    });
  });

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.throw(400, 'message is not required');
  }
  users.forEach((user) => user(message));
  users.clear();

  ctx.status = 200;
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
