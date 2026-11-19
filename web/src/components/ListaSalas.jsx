import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function  ListaSalas({ aoSelecionar }) {
  const [salas, setSalas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function carregarSalas() {
      try {
        const resposta = await fetch(`${API_URL}/salas`)
        if (!resposta.ok) {
          throw new Error(`A API respondeu com status ${resposta.status}`)
        }
        const dados = await resposta.json()
        setSalas(dados)
      } catch (e) {
        console.error(e)
        setErro('Não foi possível carregar as salas. Confira se a API está ligada.')
      } finally {
        setCarregando(false)
      }
    }

    carregarSalas()
  }, [])

  if (carregando) return <p role="status">Carregando salas...</p>
  if (erro) return <p role="alert" className="erro">{erro}</p>

  return (
    <section>
      <h2>Salas</h2>
      <ul className="lista-salas">
        {salas.map((sala) => (
        <li key={sala.id}>
            <button type="button" className="cartao-sala" onClick={() => aoSelecionar(sala)}>
              <strong>{sala.nome}</strong>
              <span>
                {sala.bloco} · {sala.capacidade} pessoas ·{' '}
                {sala.tipo === 'laboratorio' ? 'Laboratório' : 'Sala'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ListaSalas