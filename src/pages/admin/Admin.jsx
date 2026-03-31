import { useState } from 'react';
import './Admin.css';
import { PesquisarConteudo } from './PesquisarConteudo';

const mockData = {
    Redações: [
        { id: 1, title: 'Perspectivas acerca do envelhecimento na sociedade brasileira', author: 'Maria Silva', genero: 'Redação', data: '30/11/2024', status: 'Publicado' },
        { id: 2, title: 'Desafios da educação no Brasil', author: 'João Santos', genero: 'Redação', data: '04/12/2024', status: 'Publicado' },
    ],
    Contos: [
        { id: 3, title: 'O Velho e o Rio', author: 'Ana Costa', genero: 'Conto', data: '10/01/2025', status: 'Publicado' },
        { id: 4, title: 'A Última Chuva do Sertão', author: 'Carlos Lima', genero: 'Conto', data: '18/01/2025', status: 'Publicado' },
    ],
    Crônicas: [
        { id: 5, title: 'Segunda de manhã no sertão', author: 'Pedro Lima', genero: 'Crônica', data: '15/01/2025', status: 'Publicado' },
    ],
    Cordéis: [
        { id: 6, title: 'Cordel da Seca e da Esperança', author: 'Lucas Mendes', genero: 'Cordel', data: '20/02/2025', status: 'Publicado' },
    ],
};

const tabs = ['Redações', 'Contos', 'Crônicas', 'Cordéis'];

function getAddLabel(tab) {
    const map = { Redações: 'Redação', Contos: 'Conto', Crônicas: 'Crônica', Cordéis: 'Cordel' };
    return map[tab] || tab;
}

/* ── SVG ICONS ── */
function IconEdit() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function IconSearch() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function IconHistory() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.46" />
        </svg>
    );
}

function IconUsers() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function IconSettings() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}

function IconEye() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function IconPencil() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
    );
}

function IconTrash() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}

function IconBook() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function IconPlus() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

const menuGroups = [
    {
        section: 'MENU PRINCIPAL',
        items: [
            { label: 'Editar Conteúdo', icon: <IconEdit />, key: 'editar' },
            { label: 'Pesquisar Conteúdo', icon: <IconSearch />, key: 'pesquisar' },
            { label: 'Histórico de Publicações', icon: <IconHistory />, key: 'historico' },
        ],
    },
    {
        section: 'OUTROS',
        items: [
            { label: 'Usuários', icon: <IconUsers />, key: 'usuarios' },
            { label: 'Configurações', icon: <IconSettings />, key: 'configuracoes' },
        ],
    },
];

export function Admin() {
    const [activeTab, setActiveTab] = useState('Redações');
    const [activeMenu, setActiveMenu] = useState('editar');

    const items = mockData[activeTab] || [];

    return (
        <div className="adm-layout">

            {/* TOPBAR */}
            <header className="adm-topbar">
                <div className="adm-topbar__brand">
                    <IconBook />
                    <span>Biblioteca Viva</span>
                </div>
                <nav className="adm-topbar__nav">
                    <a href="/">Painel</a>
                    <a href="/">Página Principal</a>
                    <button className="adm-topbar__user"><IconUser /> Admin</button>
                    <button className="adm-topbar__sair">Sair</button>
                </nav>
            </header>

            <div className="adm-body">

                {/* SIDEBAR */}
                <aside className="adm-sidebar">
                    {menuGroups.map((group) => (
                        <div key={group.section} className="adm-sidebar__group">
                            <p className="adm-sidebar__section">{group.section}</p>
                            {group.items.map((item) => (
                                <button
                                    key={item.key}
                                    className={`adm-sidebar__item ${activeMenu === item.key ? 'adm-sidebar__item--active' : ''}`}
                                    onClick={() => setActiveMenu(item.key)}
                                >
                                    <span className="adm-sidebar__item-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </aside>

                {/* MAIN */}
                <main className="adm-main">
                    {activeMenu === 'pesquisar' ? (
                        <PesquisarConteudo />
                    ) : (
                        <>
                    {/* BANNER */}
                        <div className="adm-banner">
                            <h1 className="adm-banner__title">PAINEL ADMINISTRATIVO</h1>
                            <p className="adm-banner__sub">Gerencie e alimente o conteúdo da Biblioteca Viva</p>
                        </div>

                    {/* TOOLBAR */}
                        <div className="adm-toolbar">
                            <div className="adm-tabs">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        className={`adm-tab ${activeTab === tab ? 'adm-tab--active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button className="adm-add-btn">
                                <IconPlus /> Adicionar {getAddLabel(activeTab)}
                            </button>
                        </div>

                    {/* TABLE */}
                        <div className="adm-table-wrap">
                            <div className="adm-table-header">
                                <h2 className="adm-table-title">Gerenciar {activeTab}</h2>
                                <span className="adm-table-count">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
                            </div>

                            <div className="adm-list">
                                {items.map((item) => (
                                    <div className="adm-list-item" key={item.id}>
                                        <div className="adm-list-item__info">
                                            <p className="adm-list-item__title">{item.title}</p>
                                            <div className="adm-list-item__meta">
                                                <span>Por: {item.author}</span>
                                                <span>Gênero: {item.genero}</span>
                                                <span>Data: {item.data}</span>
                                            </div>
                                        </div>
                                        <div className="adm-list-item__actions">
                                            <span className="adm-badge">{item.status}</span>
                                            <button className="adm-action-btn adm-action-btn--view" title="Ver"><IconEye /></button>
                                            <button className="adm-action-btn adm-action-btn--edit" title="Editar"><IconPencil /></button>
                                            <button className="adm-action-btn adm-action-btn--delete" title="Excluir"><IconTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        </>
                    )}
                </main>

            </div>
        </div>
    );
}