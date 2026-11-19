import { useState } from 'react'
import ListaSalas from './components/ListaSalas'
import AgendaSala from './components/AgendaSala'

function App() {
  const [salaSelecionada, setSalaSelecionada] = useState(null)

  return (
    <main>
      <h1>Reserva de Salas</h1>
      {salaSelecionada ? (
        <AgendaSala sala={salaSelecionada} aoVoltar={() => setSalaSelecionada(null)} />
      ) : (
        <ListaSalas aoSelecionar={setSalaSelecionada} />
      )}
    </main>
  )
}

export default App