document.getElementById('location').addEventListener('change', function() {
    const selectedValue = this.value;
    if (selectedValue === '') {
        alert('Por favor, selecione um local.');
    } else {
        console.log('Local selecionado:', selectedValue);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Referência ao formulário e seus campos
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const locationSelect = document.getElementById('location');
    const dateInput = document.getElementById('date');

    // Função para preencher os locais de doação (pode ser feita por uma requisição AJAX se necessário)
    function fetchLocations() {
        // Supondo que os locais são obtidos de uma API ou estão embutidos
        const locations = [
            { id: 1, name: 'HemoSC - Florianópolis' },
            { id: 2, name: 'HemoSC - Joinville' },
            { id: 3, name: 'HemoSC - Blumenau' }
        ];

        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location.name;
            option.textContent = location.name;
            locationSelect.appendChild(option);
        });
    }

    // Chama a função para preencher os locais ao carregar a página
    fetchLocations();

    // Função para lidar com o envio do formulário
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita o comportamento padrão do formulário

        // Captura os valores dos campos
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const location = locationSelect.value;
        const date = dateInput.value;

        // Verifica se todos os campos estão preenchidos
        if (!name || !email || !phone || !location || !date) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Criação do objeto de dados
        const data = {
            nome: name,
            email: email,
            telefone: phone,
            local_doacao: location,
            data_doacao: date
        };

        try {
            // Envia os dados para o backend usando Fetch API
            const response = await fetch('/api/agendamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Agendamento realizado com sucesso!');
                form.reset(); // Limpa o formulário após o envio bem-sucedido
            } else {
                alert(`Erro ao agendar: ${result.msg}`);
            }
        } catch (error) {
            console.error('Erro ao enviar o agendamento:', error);
            alert('Ocorreu um erro ao tentar agendar sua doação. Por favor, tente novamente mais tarde.');
        }
    });
});
