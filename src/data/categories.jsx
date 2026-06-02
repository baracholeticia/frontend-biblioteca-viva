import {
  IconAward, IconScrollText, IconDoc, IconFeather,
  IconBookmark, IconNewspaper, IconBarChart, IconPalette,
  IconVideo, IconGlobe, IconPencil
} from '../components/icons';

export const categories = [
  { id: 'redacoes',      title: 'Redações Nota 10',    icon: <IconAward size={28} />,      color: 'red' },
  { id: 'cordeis',       title: 'Cordéis',             icon: <IconScrollText size={28} />, color: 'orange' },
  { id: 'contos',        title: 'Contos',              icon: <IconDoc size={28} />,        color: 'blue' },
  { id: 'cronicas',      title: 'Crônicas',            icon: <IconFeather size={28} />,    color: 'purple' },
  { id: 'poemas',        title: 'Poemas',              icon: <IconPencil size={28} />,     color: 'purple-light' },
  { id: 'clube-leitura', title: 'Clube de Leitura',    icon: <IconBookmark size={28} />,   color: 'green' },
  { id: 'jornal',        title: 'Jornal da Escola',    icon: <IconNewspaper size={28} />,  color: 'light-purple' },
  { id: 'infograficos',  title: 'Infográficos',        icon: <IconBarChart size={28} />,   color: 'teal' },
  { id: 'artes',         title: 'Galeria de Artes',    icon: <IconPalette size={28} />,    color: 'pink' },
  { id: 'videos',        title: 'Vídeos Autorais',     icon: <IconVideo size={28} />,      color: 'dark-orange' },
  { id: 'libras',        title: 'Literatura em Libras', icon: <IconGlobe size={28} />,      color: 'dark-blue' },
];