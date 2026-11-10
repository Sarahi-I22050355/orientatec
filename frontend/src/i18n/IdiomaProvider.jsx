import { useEffect, useMemo, useState } from 'react';
import { IdiomaContext, crearEtiqueta } from './contexto';
import { IDIOMAS, TEXTOS } from './textos';

const CLAVE = 'orientatec_idioma';

// El sitio arranca en español (como siempre). Si la persona eligió inglés,
// se recuerda en este navegador para la próxima visita.
const idiomaInicial = () => {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (IDIOMAS.includes(guardado)) return guardado;
  } catch { /* almacenamiento bloqueado: se usa español */ }
  return 'es';
};

function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(idiomaInicial);

  useEffect(() => {
    document.documentElement.lang = idioma;
    try { localStorage.setItem(CLAVE, idioma); } catch { /* sin almacenamiento */ }
  }, [idioma]);

  const valor = useMemo(() => ({
    idioma,
    setIdioma,
    t: TEXTOS[idioma],
    etiqueta: crearEtiqueta(idioma),
  }), [idioma]);

  return <IdiomaContext.Provider value={valor}>{children}</IdiomaContext.Provider>;
}

export default IdiomaProvider;
