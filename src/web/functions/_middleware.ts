import proxyflare from "@flaregun-net/proxyflare-for-pages";

export const onRequest = (context) => {
  const targetApiUrl = context.env.BACKEND_API_URL;

  const routes = [{ from: { pattern: "/api/*" }, to: { url: targetApiUrl } }];

  return proxyflare({
    config: {
      routes,
    },
  })(context);
};
