import { Header } from '../../components/header/Header';
import { Hero } from '../../components/hero/Hero';
import { Sections } from '../../components/sections/Sections';
import { Essays } from '../../components/essays/Essays';
import { Literaturas } from '../../components/literaturas/Literaturas';
import { Footer } from '../../components/footer/Footer';
import {ContosCronicas} from "../../components/contos-cronicas/ContosCronicas.jsx";
import {ClubeLeitura} from "../../components/clube-leitura/ClubeLeitura.jsx";
import {JornalEscola} from "../../components/jornal-escola/JornalEscola.jsx";
import {Multimidia} from "../../components/multimidia/Multimidia.jsx";
import {MateriaisDestaque} from "../../components/materiais-destaque/MateriaisDestaque.jsx";

export function Home() {
    return (
        <main>
            <Header />
            <Hero />
            <div id="acervo">
                <Sections />
                <Essays />
                <Literaturas />
                <ContosCronicas />
                <ClubeLeitura />
                <JornalEscola />
                <Multimidia />
                <MateriaisDestaque />
            </div>
            <Footer />
        </main>
    );
}