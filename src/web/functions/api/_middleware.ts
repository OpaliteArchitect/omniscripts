export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  const backendUrl = new URL(
    url.pathname + url.search,
    context.env.BACKEND_API_URL,
  );

  const proxyRequest = new Request(backendUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body:
      context.request.method === "GET" || context.request.method === "HEAD"
        ? null
        : context.request.body,
    redirect: "manual",
  });

  return fetch(proxyRequest);
};
