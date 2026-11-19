import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

const FORM_VAZIO = { responsavel: '', horaInicio: '', horaFim: '', motivo: '' }

function formatarData(data) {
  return data.split('-').reverse().join('/')
}

function FormReserva({ sala, data, aoCriar }) {
  const [form, setForm] = useState(FORM_VAZIO)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(null)

  function alterar(campo) {
    return (e) => setForm({ ...form, [campo]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    setSucesso(null)

    try {
      const resposta = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sala_id: sala.id,
          responsavel: form.responsavel,
          data,
          hora_inicio: form.horaInicio,
          hora_fim: form.horaFim,
          motivo: form.motivo,
        }),
      })
      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro)
        return
      }

      setSucesso(`Reserva criada: ${dados.hora_inicio} às ${dados.hora_fim}.`)
      setForm(FORM_VAZIO)
      aoCriar()
    } catch (e) {
      console.error(e)
      setErro('Não foi possível enviar a reserva. Confira se a API está ligada.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h3>Nova reserva para {formatarData(data)}</h3>

      <label className="campo">
        Responsável
        <input type="text" value={form.responsavel} onChange={alterar('responsavel')} />
      </label>

      <div className="linha">
        <label className="campo">
          Início
          <input type="time" value={form.horaInicio} onChange={alterar('horaInicio')} />
        </label>
        <label className="campo">
          Fim
          <input type="time" value={form.horaFim} onChange={alterar('horaFim')} />
        </label>
      </div>

      <label className="campo">
        Motivo (opcional)
        <input type="text" value={form.motivo} onChange={alterar('motivo')} />
      </label>

      {erro && <p role="alert" className="erro">{erro}</p>}
      {sucesso && <p role="status" className="sucesso">{sucesso}</p>}

      <button type="submit" className="botao-principal" disabled={enviando}>
        {enviando ? 'Reservando...' : 'Reservar'}
      </button>
    </form>
  )
}

export default FormReserva