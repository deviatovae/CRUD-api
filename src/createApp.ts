import { createRouter } from './routes';

export const createApp = () => {
  const router = createRouter();

  return async function (req, res) {
    await router.handleRequest(req, res);
  };
};
