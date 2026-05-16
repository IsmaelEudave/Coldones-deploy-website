# Perspective Gallery Component

Single horizontal row, full viewport width, 3D perspective tilt (low-left / high-right), seamless infinite scroll.

To restore this gallery, apply the three pieces below to `index.html`.

---

## 1 — CSS

Replace the existing `.svc-gallery-wrap` rule and add the perspective block.
Paste this in place of:
```
.svc-gallery-wrap { margin: 4.5rem 0; }
.svc-gallery-header { ... }
```

```css
/* ==================== GALLERY IN SERVICES ==================== */
.svc-gallery-wrap {
  margin-top: 4.5rem;
  margin-bottom: 4.5rem;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  /* negative top/bottom allow 3D overflow, 0 left/right prevents scrollbar */
  clip-path: inset(-15rem 0 -20rem 0);
}
.svc-gallery-header { text-align: center; max-width: 600px; margin: 0 auto 2.5rem; }

/* ==================== PERSPECTIVE GALLERY ==================== */
.pg-outer {
  padding: 3rem 0;
}
.pg-stage {
  /* low end left, high end right */
  transform: perspective(900px) rotateX(16deg) rotateY(8deg) rotateZ(-10deg);
  transform-style: preserve-3d;
  transform-origin: center center;
}
.pg-track {
  display: flex; gap: 1.25rem;
  width: max-content;
  will-change: transform; transform: translateZ(0);
  backface-visibility: hidden;
  animation: pg-scroll 35s linear infinite;
  animation-play-state: paused; /* JS plays after setup — eliminates reset stutter */
}
@keyframes pg-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(var(--pg-dist, -50%)); }
}
.pg-slide {
  flex-shrink: 0; width: 300px; height: 220px;
  border-radius: 14px; overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px -10px rgba(0,0,0,0.2), 0 4px 12px rgba(196,154,18,0.1);
  transition: transform 0.3s ease, border-color 0.3s;
}
.pg-slide:hover { transform: scale(1.04); border-color: rgba(196,154,18,0.45); }
.pg-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (max-width: 768px) { .pg-slide { width: 200px; height: 148px; } }
```

---

## 2 — HTML

Inside `<!-- Gallery Section -->`, replace the `<div class="about-slider-wrap">...</div>` block with:

```html
<div class="pg-outer">
  <div class="pg-stage">
    <div class="pg-track" id="pgTrack">
      <div class="pg-slide"><img src="brand_assets/AboutImages/webp/IMG_4668.webp" alt="Coldones Events DJ setup" width="640" height="427" loading="lazy" decoding="async"></div>
      <div class="pg-slide"><img src="brand_assets/AboutImages/webp/DSC_6267.webp" alt="Coldones Events live performance" width="640" height="427" loading="lazy" decoding="async"></div>
      <div class="pg-slide"><img src="brand_assets/AboutImages/webp/DSC_0941_Original.webp" alt="Coldones Events DJ performing" width="427" height="640" loading="lazy" decoding="async"></div>
      <div class="pg-slide"><img src="brand_assets/AboutImages/webp/IMG_4412.webp" alt="Coldones Events event lighting" width="427" height="640" loading="lazy" decoding="async"></div>
      <div class="pg-slide"><img src="brand_assets/AboutImages/webp/763a26c9-a9a3-43ef-8f88-6f9d445e52a01.webp" alt="Coldones Events event production" width="640" height="480" loading="lazy" decoding="async"></div>
    </div>
  </div>
</div>
```

---

## 3 — JavaScript

Add this block inside the `<script>` tag (before the closing `</script>`):

```javascript
// ---- Perspective gallery track ----
(function () {
  function initPgTrack() {
    const track = document.getElementById('pgTrack');
    if (!track) return;
    track.querySelectorAll('[data-clone]').forEach(function(el) { el.remove(); });
    const origSlides = Array.from(track.querySelectorAll('.pg-slide'));
    if (!origSlides.length) return;
    const colGap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const slideW = origSlides[0].getBoundingClientRect().width;
    const setWidth = origSlides.length * (slideW + colGap);
    const needed = Math.ceil((window.innerWidth * 5) / setWidth) + 2;
    for (let i = 0; i < needed; i++) {
      origSlides.forEach(function(slide) {
        const clone = slide.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('data-clone', '1');
        track.appendChild(clone);
      });
    }
    track.style.setProperty('--pg-dist', `-${setWidth}px`);
    track.style.animationPlayState = 'paused';
    void track.offsetWidth;
    track.style.animationPlayState = 'running';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPgTrack);
  } else {
    initPgTrack();
  }
  let _pgTimer, _pgLastW = window.innerWidth;
  window.addEventListener('resize', function () {
    const w = window.innerWidth;
    if (w === _pgLastW) return;
    _pgLastW = w;
    clearTimeout(_pgTimer);
    _pgTimer = setTimeout(initPgTrack, 150);
  });
})();
```

---

## Notes

- The existing `initSlider` JS (for `.about-slider-track`) must be **removed or left unused** when this gallery is active — it targets a different element so it does nothing if the flat slider HTML isn't present.
- To switch back to the flat slider, see the original `about-slider-wrap` structure in git history or ask Claude to restore it.
