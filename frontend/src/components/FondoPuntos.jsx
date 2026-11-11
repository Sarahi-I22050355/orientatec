import { useEffect, useRef } from 'react';

// Rejilla de puntos del fondo, la misma en todas las páginas.
const PUNTOS = 'radial-gradient(circle, #ffffff0d 1px, transparent 1px)';
// Los mismos puntos, un poco más grandes y claros (azul muy suave, como el
// resto de los textos del sitio). Solo se ven alrededor del cursor.
const PUNTOS_BRILLO = 'radial-gradient(circle, rgba(191, 219, 254, 0.75) 1.4px, transparent 1.6px)';
const TAMANO = '28px 28px';
// Radio del círculo de luz que sigue al cursor.
const RADIO = 180;

const MASCARA = `radial-gradient(${RADIO}px circle at var(--cursor-x, -9999px) var(--cursor-y, -9999px),
  #000 0%, rgba(0, 0, 0, 0.45) 45%, transparent 100%)`;

/**
 * Fondo de puntos con brillo que sigue al cursor (como el de Stitch).
 * `posicion` debe ser la misma que usaba la página ('fixed' o 'absolute')
 * para que la rejilla quede exactamente donde estaba.
 */
export default function FondoPuntos({ posicion = 'fixed' }) {
  const brillo = useRef(null);

  useEffect(() => {
    const capa = brillo.current;
    if (!capa) return;
    let frame = 0;
    let ultimo = null;

    const pintar = () => {
      frame = 0;
      if (!ultimo) return;
      // Coordenadas relativas a la capa, para que coincidan con la rejilla.
      const caja = capa.getBoundingClientRect();
      capa.style.setProperty('--cursor-x', `${ultimo.x - caja.left}px`);
      capa.style.setProperty('--cursor-y', `${ultimo.y - caja.top}px`);
      capa.style.opacity = '1';
    };

    const mover = (e) => {
      // En pantallas táctiles no hay cursor: no se muestra el brillo.
      if (e.pointerType && e.pointerType !== 'mouse') return;
      ultimo = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(pintar);
    };

    const salir = (e) => {
      if (!e.relatedTarget) capa.style.opacity = '0';
    };

    window.addEventListener('pointermove', mover, { passive: true });
    document.addEventListener('mouseout', salir);
    return () => {
      window.removeEventListener('pointermove', mover);
      document.removeEventListener('mouseout', salir);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className={`${posicion} inset-0 pointer-events-none`}
        style={{ backgroundImage: PUNTOS, backgroundSize: TAMANO }} />
      <div ref={brillo} aria-hidden="true"
        className={`${posicion} inset-0 pointer-events-none transition-opacity duration-300`}
        style={{
          opacity: 0,
          backgroundImage: PUNTOS_BRILLO,
          backgroundSize: TAMANO,
          maskImage: MASCARA,
          WebkitMaskImage: MASCARA,
        }} />
    </>
  );
}
