const apiUrl = 'http://seu-endereco-api.com/usuario'; // Altere para a URL correta da sua API

// Função para listar usuários
function listarUsuarios() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const usuarioContainer = document.getElementById('usuario-list');
            usuarioContainer.innerHTML = ''; // Limpa o container antes de listar

            data.forEach(usuario => {
                const usuarioItem = document.createElement('div');
                usuarioItem.className = 'usuario-item mb-2 p-2 border rounded';
                usuarioItem.innerHTML = `
                    <p><strong>ID:</strong> ${usuario.id}</p>
                    <p><strong>Nome:</strong> ${usuario.nome}</p>
                    <p><strong>Telefone:</strong> ${usuario.telefone}</p>
                    <p><strong>Email:</strong> ${usuario.email}</p>
                    <p><strong>CPF:</strong> ${usuario.cpf}</p>
                    <p><strong>Tipo Sanguíneo:</strong> ${usuario.tipo_sanguineo}</p>
                    <button onclick="editarUsuario(${usuario.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                    <button onclick="excluirUsuario(${usuario.id})" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
                `;
                usuarioContainer.appendChild(usuarioItem);
            });
        })
        .catch(error => console.error('Erro ao listar usuários:', error));
}

// Função para criar um novo usuário
function criarUsuario() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const tipoSanguineo = document.getElementById('tipo_sanguineo').value;

    const data = { nome, telefone, email, cpf, tipo_sanguineo };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert(result.msg);
        listarUsuarios(); // Atualiza a lista após a criação
    })
    .catch(error => console.error('Erro ao criar usuário:', error));
}

// Função para excluir um usuário
function excluirUsuario(id) {
    fetch(`${apiUrl}?id=${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        alert(result.msg);
        listarUsuarios(); // Atualiza a lista após a exclusão
    })
    .catch(error => console.error('Erro ao excluir usuário:', error));
}

// Função para editar um usuário
function editarUsuario(id) {
    const nome = prompt("Novo Nome:");
    const telefone = prompt("Novo Telefone:");
    const email = prompt("Novo Email:");
    const cpf = prompt("Novo CPF:");
    const tipoSanguineo = prompt("Novo Tipo Sanguíneo:");

    const data = { nome, telefone, email, cpf, tipo_sanguineo: tipoSanguineo };

    fetch(`${apiUrl}?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert(result.msg);
        listarUsuarios(); // Atualiza a lista após a edição
    })
    .catch(error => console.error('Erro ao editar usuário:', error));
}

// Carrega a lista de usuários ao iniciar a página
document.addEventListener('DOMContentLoaded', listarUsuarios);
