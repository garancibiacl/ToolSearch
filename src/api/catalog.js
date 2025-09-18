// Simple API wrapper to fetch banner catalog from public JSON endpoints
// Uses the requested logic: fetch two files and merge with generated IDs and metadata

export async function fetchCatalog() {
  try {
    // Try multiple paths to be resilient to folder layout
    const tryPaths = async (paths) => {
      for (const p of paths) {
        try { const res = await fetch(p); if (res.ok) return await res.json() } catch {}
      }
      return []
    }

    const a = await tryPaths(['/backend/banners.json','/backend/data/banners.json'])
    const b = await tryPaths(['/backend/cyber-banner.json','/backend/data/cyber-banner.json'])

    const withIds = (arr, scope) => (arr || []).map((x, i) => ({
      id: x.id || `${scope}-${i}-${(x.nombre || '').slice(0, 10)}`,
      categoria: x.categoria || 'Banner',
      createdAt: Date.now() - i * 1000,
      ...x,
    }))

    return [ ...withIds(a, 'b'), ...withIds(b, 'c') ]
  } catch (e) {
    console.error('Error al cargar catálogo', e)
    return []
  }
}
