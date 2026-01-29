// app/mocks/browser.ts (actualizar)
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// Configuración adicional para debugging
worker.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});

worker.events.on('request:match', ({ request }) => {
  console.log('MSW matched:', request.method, request.url);
});

worker.events.on('request:unhandled', ({ request }) => {
  console.log('MSW unhandled:', request.method, request.url);
});