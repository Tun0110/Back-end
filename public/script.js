const API_URL = 'http://localhost:3000/api/alunos';

const form = document.getElementById('aluno-form');
const tbody = document.getElementById('alunos-tbody');
const btnCancel = document.getElementById('btn-cancel'); 
const btnSave = document.getElementById('btn-save');

// Campos do form
const inputId = document.getElementById('aluno-id');
const inputNome = document.getElementById('nome');
const inputCpf = document.getElementById('cpf');
const inputIdade = document.getElementById('idade');
const inputEmail = document.getElementById('email');
const inputCurso = document.getElementById('curso');
// Estado local
let editandoId = null;

// 1. LER (GET): Buscar dados do Backend e renderizar na tela
async function carregarAlunos() {
    try {
        const resposta = await fetch(API_URL);
        const alunos = await resposta.json();

        tbody.innerHTML = '';
        if(alunos.lengh ===0) {
            tbody.innerHTML = '<tr><td colspan="5" stylr="text-align:center;">Nenhum aluno cadastrado.</td></tr>'
        return;
        }
        alunos.forEach (aluno => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>#${aluno.id}</td>
            <td>${aluno.cpf}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.email}</td>
            <td>${aluno.curso}</td>
            <td class="actions">
                <button class="btn-icon btn-edit" onclick="iniciarEdicao(${aluno.id}, '${aluno.nome}', '${aluno.cpf}', '${aluno.idade}, '${aluno.email}', '${aluno.curso}')">Editar</button>
                <button class="btn-icon btn-delete" onclick="deletarAluno(${aluno.id}, '${aluno.nome}', '${aluno.cpf}', '${aluno.idade}', '${aluno.email}', '${aluno.curso}')">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao buscar alunos:', erro);
        alert('Erro de conexão com o servido!');
    }
}
// 2. CRIAR ou ATUALIZAR (POST / PUT)
form.addEventListener('subimt', async (e) => {
    e.preventDefault(); // Evitar recarregar a pagína

    const aluno = {
        nome: inputNome.valeu,
        cpf: inputCpf.valeu,
        idade: inputIdade.valeu,
        email: inputEmail.valeu,
        curso: inputCurso.valeu
    };
    try {
        if (editandoId) {
            // Se tem um ID, estamos editando (PUT)
            await fetch(`${API_URL}/${editandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify(aluno)
            });
            editandoId = null; // Reseta o estado 
        } else {
            // Se não tem ID, estamos criando (POST)
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify(aluno)
            });
        }

        resetarFormulario();
        carregarAlunos(); // Recarregar a lista atualizada
        // do backend
    } catch (erro) {
        console.error('Erro ao salvar:', erro);
        alert('Erro ao salvar os dados no servidor!');
    }
});