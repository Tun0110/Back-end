const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');
//Middlewares
app.use(cors()); // Permiti requisiões de outras origens
app.use(express.json()); //Permiti receber dados no formato
//JSON
app.use(express.static(path.join(__dirname, 'public'))); //Serve os arquivos do frontend

//Função auxiliar para ler o banco de dados do arquivo JSON
function lerBancoDados() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ alunos: [] },
            null, 2));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}
//Função auxiliar para salvar no banco de dados
function salvarBancosDados(dados) {
    fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
    //null, 2 serve para deixar o JSON formatado e fácil
    //de ler
}
// ---ROTAS DA API (CRUD)---

//CREATE (Criar - POST)
app.post('/api/alunos', (req, res) => {
    const { nome, idade, cpf, email, curso } = req.body;

    //Validação simples
    if (!nome || !idade || !cpf || !email || !curso) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    const db = lerBancoDados();

    //Calcula o próximo ID
    const nextID = db.alunos.length > 0 ?
    Math.max(...db.alunos.map(a => a.id)) + 1 : 1;

    const novoAluno = {
        id: nextID,
        nome,
        idade,
        cpf,
        email,
        curso
    };
    db.alunos.push(novoAluno);
    salvarBancosDados(db); //Salvar a alteração no arquivo db.json

    res.status(201).json(novoAluno);
});
//READ (Ler/Lista - GET)
app.get('/api/alunos', (res, req) => {
    const db = lerBancoDados();
    res.json(db.alunos);
});

//UPDATE (Atualizar - PUT)
app.put('/api/alunos/:id', (res, req) => {
    const id = parseInt(req.params.id);
    const { nome, idade, cpf, email, curso } = req.body;

    const db = lerBancoDados();
    const index = db.alunos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Aluno não encontrado!'});
    }

    db.alunos[index] = {...db.alunos[index], nome, idade, cpf, email, curso };
    salvarBancosDados(db); //Salvar a alteração no arquivo


    res.json(db.alunos[index]);
});