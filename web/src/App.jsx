import { useState } from 'react'
import ListaSalas from './components/ListaSalas'
import AgendaSala from './components/AgendaSala'

function App() {
  const [salaSelecionada, setSalaSelecionada] = useState(null)

  return (
    <>
      <header className="topo">
        <div className="topo-conteudo">
          <h1>Reserva de Salas</h1>
          <p>Agenda de salas e laboratórios</p>
        </div>
      </header>

      <main>
        {salaSelecionada ? (
          <AgendaSala sala={salaSelecionada} aoVoltar={() => setSalaSelecionada(null)} />
        ) : (
          <ListaSalas aoSelecionar={setSalaSelecionada} />
        )}
      </main>

      <footer className="rodape">
        Feito por Vitória Miranda ·{' '}
        <a href="https://github.com/vitoriasmiranda/reserva-salas">ver o código no GitHub</a>
      </footer>
    </>
  )
}
export default App