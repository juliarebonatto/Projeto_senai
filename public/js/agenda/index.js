const apiUrl = 'http://seu-endereco-api.com/agenda'; // Altere para a URL correta da sua API

// Função para listar agendas
function listarAgendas() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const agendaContainer = document.getElementById('agenda-list');
            agendaContainer.innerHTML = ''; // Limpa o container antes de listar

            data.forEach(agenda => {
                const agendaItem = document.createElement('div');
                agendaItem.className = 'agenda-item mb-2 p-2 border rounded';
                agendaItem.innerHTML = `
                    <p><strong>Hemocentro:</strong> ${agenda.hemocentro_nome}</p>
                    <p><strong>Dia:</strong> ${agenda.dia}</p>
                    <p><strong>Horário:</strong> ${agenda.horario}</p>
                    <button onclick="editarAgenda(${agenda.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                    <button onclick="excluirAgenda(${agenda.id})" class="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
                `;
                agendaContainer.appendChild(agendaItem);
            });
        })
        .catch(error => console.error('Erro ao listar agendas:', error));
}

// Função para criar uma nova agenda
function criarAgenda() {
    const hemocentroId = document.getElementById('hemocentro_id').value;
    const dia = document.getElementById('dia').value;
    const horario = document.getElementById('horario').value;

    const data = { hemocentro_id: hemocentroId, dia, horario };

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
        listarAgendas(); // Atualiza a lista após a criação
    })
    .catch(error => console.error('Erro ao criar agenda:', error));
}

// Função para excluir uma agenda
function excluirAgenda(id) {
    fetch(`${apiUrl}?id=${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        alert(result.msg);
        listarAgendas(); // Atualiza a lista após a exclusão
    })
    .catch(error => console.error('Erro ao excluir agenda:', error));
}

// Função para editar uma agenda
function editarAgenda(id) {
    const hemocentroId = prompt("Novo Hemocentro ID:");
    const dia = prompt("Novo Dia (YYYY-MM-DD):");
    const horario = prompt("Novo Horário (HH:MM):");

    const data = { hemocentro_id: hemocentroId, dia, horario };

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
        listarAgendas(); // Atualiza a lista após a edição
    })
    .catch(error => console.error('Erro ao editar agenda:', error));
}

// Carrega a lista de agendas ao iniciar a página
document.addEventListener('DOMContentLoaded', listarAgendas);
