export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.toLowerCase();

  const blockedPatterns = [
    ".env",
    ".aws",
    "phpinfo",
    "_profiler",
    ".php",
    "config/.env",
    ".env.backup",
    ".env.example"
  ];

  const shouldBlock = blockedPatterns.some(pattern => path.includes(pattern));

  if (shouldBlock) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "frame-ancestors https://teams.microsoft.com/;"
      }
    });
  }

  const response = await context.next();
  const newResponse = new Response(response.body, response);

  newResponse.headers.set(
    "Content-Security-Policy",
    "frame-ancestors https://teams.microsoft.com/;"
  );

  newResponse.headers.set("X-Content-Type-Options", "nosniff");
  newResponse.headers.set("Referrer-Policy", "no-referrer");
  newResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
  newResponse.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );

  return newResponse;
}
