import { createContext, useContext } from 'react';
import { TEXTOS, ETIQUETAS_EN } from './textos';

export const IdiomaContext = createContext({
  idioma: 'es',
  setIdioma: () => {},
  t: TEXTOS.es,
  etiqueta: (valor) => valor,
});

// Uso: const { idioma, setIdioma, t, etiqueta } = useIdioma();
//  - t: textos de la interfaz en el idioma actual
//  - etiqueta(valor): traduce para mostrar un valor que se guarda en español
export const useIdioma = () => useContext(IdiomaContext);

export const crearEtiqueta = (idioma) => (valor) =>
  idioma === 'en' ? (ETIQUETAS_EN[valor] ?? valor) : valor;
