// app/mocks/index.ts (actualizado)
export async function enableMocking() {
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true' || 
                   window.location.hostname.includes('github.io');
  
  if (useMocks) {
    const { worker } = await import('./browser');
    
    // ✅ Detectar la ruta base automáticamente
    const baseUrl = import.meta.env.BASE_URL || '/';
    const serviceWorkerUrl = `${baseUrl}mockServiceWorker.js`;
    
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: serviceWorkerUrl,
      },
    });

    console.log('🔶 MSW enabled with service worker at:', serviceWorkerUrl);
    return worker;
  }

  console.log('🔶 MSW disabled - using real backend');
  return null;
}

export async function disableMocking() {
  if (typeof window !== "undefined") {
    const { worker } = await import("./browser");
    await worker.stop();
    console.log("🔶 MSW disabled");
  }
}