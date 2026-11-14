// Service worker tối thiểu: chỉ để trình duyệt coi trang là PWA cài được, cache phần khung giao diện để mở nhanh hơn khi mất mạng.
const CACHE = 'ghi-chu-v2';
const SHELL = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Chỉ phục vụ từ cache cho khung giao diện; dữ liệu (GitHub API, ảnh) luôn lấy từ mạng để không bị cũ.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Network-first: luôn lấy bản mới nhất khi có mạng (để các bản sửa tới được máy người dùng), mất mạng mới dùng cache.
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
