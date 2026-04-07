import {
  IconAward, IconScrollText, IconDoc, IconFeather,
  IconBookmark, IconNewspaper, IconBarChart, IconPalette,
  IconVideo, IconGlobe
} from '../components/icons';

export const categories = [
  { id: 'redacoes',      title: 'Redações Nota 10',    icon: <IconAward size={28} />,       color: 'red',          count: 245 },
  { id: 'cordeis',       title: 'Cordéis',              icon: <IconScrollText size={28} />,  color: 'orange',       count: 189 },
  { id: 'contos',        title: 'Contos',               icon: <IconDoc size={28} />,         color: 'blue',         count: 342 },
  { id: 'cronicas',      title: 'Crônicas',             icon: <IconFeather size={28} />,     color: 'purple',       count: 276 },
  { id: 'clube-leitura', title: 'Clube de Leitura',     icon: <IconBookmark size={28} />,    color: 'green',        count: 156 },
  { id: 'jornal',        title: 'Jornal da Escola',     icon: <IconNewspaper size={28} />,   color: 'light-purple', count: 98  },
  { id: 'infograficos',  title: 'Infográficos',         icon: <IconBarChart size={28} />,    color: 'teal',         count: 127 },
  { id: 'artes',         title: 'Galeria de Artes',     icon: <IconPalette size={28} />,     color: 'pink',         count: 213 },
  { id: 'videos',        title: 'Vídeos Autorais',      icon: <IconVideo size={28} />,       color: 'dark-orange',  count: 87  },
  { id: 'libras',        title: 'Literatura em Libras', icon: <IconGlobe size={28} />,       color: 'dark-blue',    count: 45  },
];