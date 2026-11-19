import { useEffect, useState } from 'react'
import FormReserva from './FormReserva'

const API_URL = import.meta.env.VITE_API_URL

function hoje() {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function AgendaSala({ sala, aoVoltar }) {
  const [data, setData] = useState(hoje())
  const [reservas, setReservas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [versao, setVersao] = useState(0)
  const [erroCancelar, setErroCancelar] = useState(null)

  useEffect(() => {
    async function carregarReservas() {
      setCarregando(true)
      setErro(null)
      try {
        const resposta = await fetch(`${API_URL}/salas/${sala.id}/reservas?data=${data}`)
        if (!resposta.ok) {
          throw new Error(`A API respondeu com status ${resposta.status}`)
        }
        const dados = await resposta.json()
        setReservas(dados)
      } catch (e) {
        console.error(e)
        setErro('Não foi possível carregar a agenda. Confira se a API está ligada.')
      } finally {
        setCarregando(false)
      }
    }

    carregarReservas()
  }, [sala.id, data, versao])

    async function cancelarReserva(reserva) {
    const confirmou = window.confirm(
            `Apagar a reserva de ${reserva.responsavel}, das ${reserva.hora_inicio} às ${reserva.hora_fim}?\n\nClique em OK para apagar.`
    )
    if (!confirmou) return

    setErroCancelar(null)
    try {
      const resposta = await fetch(`${API_URL}/reservas/${reserva.id}`, { method: 'DELETE' })
      if (!resposta.ok) {
        const dados = await resposta.json()
        setErroCancelar(dados.erro)
        return
      }
      setVersao((v) => v + 1)
    } catch (e) {
      console.error(e)
      setErroCancelar('Não foi possível cancelar a reserva. Confira se a API está ligada.')
    }
  }

  return (
    <section>
      <button type="button" className="botao-voltar" onClick={aoVoltar}>
        ← Voltar para as salas
      </button>

      <h2>{sala.nome}</h2>
      <p className="detalhe">
        {sala.bloco} · {sala.capacidade} pessoas
      </p>

      <label className="campo">
        Data
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
      </label>

      {carregando && <p>Carregando agenda...</p>}
      {erro && <p role="alert" className="erro">{erro}</p>}
      {erroCancelar && <p role="alert" className="erro">{erroCancelar}</p>}

      {!carregando && !erro && reservas.length === 0 && (
        <p>Nenhuma reserva neste dia. A sala está livre.</p>
      )}

      {!carregando && !erro && reservas.length > 0 && (
        <ul className="lista-reservas">
          {reservas.map((reserva) => (
            <li key={reserva.id} className="cartao-reserva">
              <div className="info-reserva">
                <strong>
                  {reserva.hora_inicio} às {reserva.hora_fim}
                </strong>
                <span>{reserva.responsavel}</span>
                {reserva.motivo && <span className="detalhe">{reserva.motivo}</span>}
              </div>
              <button
                type="button"
                className="botao-cancelar"
                onClick={() => cancelarReserva(reserva)}
                aria-label={`Cancelar a reserva de ${reserva.responsavel}, das ${reserva.hora_inicio} às ${reserva.hora_fim}`}
              >
                Apagar
              </button>
            </li>
          ))}
        </ul>
      )}
        <FormReserva sala={sala} data={data} aoCriar={() => setVersao((v) => v + 1)} />
    </section>
  )
}

export default AgendaSala