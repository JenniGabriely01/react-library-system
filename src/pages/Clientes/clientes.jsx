import BarraSearch from "../../components/barraSearch/barraSearch";
import MenuLateral from "../../components/menuLateral/menuLateral";
import TituloGrande from "../../components/tituloGrande/tituloGrande";
import EstatisticBlock from "../../components/EstatisticBlock/estatisticblock";
import Button from "../../components/button/button";
import { useState, useEffect } from 'react';
import './clientes.css';

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [mostrarTodos, setMostrarTodos] = useState(false);
    const [totalClientes, setTotalClientes] = useState(0);
    const [clientesRecentes, setClientesRecentes] = useState(0); // Contagem de clientes adicionados nos últimos 7 dias
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [livrosCount, setLivrosCount] = useState(0);
    const [livrosEmprestadosCount, setLivrosEmprestadosCount] = useState(0);

    // Buscar todos os clientes
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/clientes`);
                const data = await response.json();
                setTotalClientes(data.length);
                setClientes(data);
                setFilteredClientes(data.slice(0, mostrarTodos ? data.length : 6));

                // Filtrar clientes dos últimos 7 dias
                const seteDiasAtras = new Date();
                seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
                const recentes = data.filter(cliente => new Date(cliente.createdAt) >= seteDiasAtras);
                setClientesRecentes(recentes.length); // Atualiza a contagem de clientes recentes
            } catch (error) {
                console.log("Erro ao buscar clientes", error);
            }
        };
        fetchClientes();
    }, [mostrarTodos]);

    useEffect(() => {
        const filtered = clientes.filter(cliente =>
            cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.sobrenome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClientes(filtered.slice(0, mostrarTodos ? filtered.length : 6));
    }, [searchTerm, clientes, mostrarTodos]);

    useEffect(() => {
        const fetchLivrosCount = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/livros/count');
                const data = await response.json();
                setLivrosCount(data.count);
            } catch (error) {
                console.log("Erro ao buscar contagem de livros", error);
            }
        };
        fetchLivrosCount();
    }, []);

    useEffect(() => {
        const fetchLivrosEmprestadosCount = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/livros/emprestados/count');
                const data = await response.json();
                setLivrosEmprestadosCount(data.count);
            } catch (error) {
                console.log("Erro ao buscar contagem de livros emprestados", error);
            }
        };
        fetchLivrosEmprestadosCount();
    }, []);

    return (
        <main className="clientes">
            <div>
                <MenuLateral />
            </div>

            <section className="conteudo-clientes">
                <header className="header-clientes">
                    <TituloGrande tituloG="Clientes da Biblioteca" />

                    <BarraSearch
                        placeholder="Pesquisar Clientes..."
                        onSearch={setSearchTerm}
                    />

                    <Button legendaBotao="Cadastrar" rota="/CadClientes" />
                </header>

                <section className="banner-container">
                    <div className="banner">
                        <div className="textoB" id="textoB">
                            <h1>{clientesRecentes} Novos Clientes</h1>
                            <h2>Adicionados essa semana</h2>
                        </div>
                        <div className="book"></div>
                    </div>
                </section>

                <div className="conteudo-cards">

                    <div className="titulos-cliente">
                        <h2>Clientes Recentes</h2>
                        {totalClientes > 6 && (
                            <button onClick={() => setMostrarTodos(!mostrarTodos)}>
                                {mostrarTodos ? "Mostrar menos" : "Ver mais"}
                            </button>
                        )}
                    </div>

                    <div className="cards-clientes">
                        {filteredClientes.map((cliente) => (
                            <div className="card-cliente" key={cliente._id}>
                                <h3>{cliente.nome} {cliente.sobrenome}</h3>
                                <div className="bottom-info">
                                    <p>2 Livro(s) emprestados</p> {/* texto temporario */}
                                    <p>{cliente.createdAt ? new Date(cliente.createdAt).toLocaleDateString() : 'Data não disponível'}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="titulos-cliente" id="titulo-cliente">
                        <h2>Estatísticas</h2>
                    </div>

                    <div className="cards-estatistica">
                        <EstatisticBlock
                            title="Clientes cadastrados"
                            amount={totalClientes}
                        />

                        <EstatisticBlock
                            title="Livros emprestados"
                            amount={livrosEmprestadosCount}
                        />

                        <EstatisticBlock
                            title="Livros cadastrados"
                            amount={livrosCount}
                        />
                    </div>

                </div>
            </section>
        </main>
    );
}
