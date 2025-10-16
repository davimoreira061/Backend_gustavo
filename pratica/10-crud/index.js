const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
app.use(express.json())

// Variáveis de ambiente
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

// URL de conexão com MongoDB Atlas
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(uri)
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err))

// Modelo de Livro
const Livro = mongoose.model('Livros', new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    editora: String,
    ano: Number,
    preco: Number
}))

// Criar novo livro
app.post('/livros', async (req, res) => {
  try {
    const { titulo, autor, editora, ano, preco } = req.body

    if (!titulo || !autor) {
      return res.status(400).json({ erro: 'Os campos título e autor são obrigatórios.' })
    }

    const novoLivro = await Livro.create({ titulo, autor, editora, ano, preco })
    res.status(201).json(novoLivro)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar livro.' })
  }
})

// Listar todos os livros
app.get('/livros', async (req, res) => {
  try {
    const livros = await Livro.find()
    res.json(livros)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar livros.' })
  }
})

// Buscar livro por ID
app.get('/livros/:id', async (req, res) => {
  try {
    const livro = await Livro.findById(req.params.id)
    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado.' })
    res.json(livro)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar livro.' })
  }
})

// Atualizar livro
app.put('/livros/:id', async (req, res) => {
  try {
    const { titulo, autor, editora, ano, preco } = req.body

    if (!titulo || !autor) {
      return res.status(400).json({ erro: 'Os campos título e autor são obrigatórios.' })
    }

    const livroAtualizado = await Livro.findByIdAndUpdate(
      req.params.id,
      { titulo, autor, editora, ano, preco },
      { new: true }
    )

    if (!livroAtualizado) return res.status(404).json({ erro: 'Livro não encontrado.' })
    res.json(livroAtualizado)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar livro.' })
  }
})

// Remover livro
app.delete('/livros/:id', async (req, res) => {
  try {
    const livroRemovido = await Livro.findByIdAndDelete(req.params.id)
    if (!livroRemovido) return res.status(404).json({ erro: 'Livro não encontrado.' })
    res.json({ mensagem: 'Livro removido com sucesso.' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover livro.' })
  }
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})
