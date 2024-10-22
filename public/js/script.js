// script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio do formulário

        const nome = document.getElementById('nome').value;
        if (nome) {
            alert(`Obrigado, ${nome}! Seu cadastro foi realizado com sucesso.`);
            // Aqui você pode enviar os dados para o PHP se necessário
            form.reset(); // Limpa o formulário
        } else {
            alert('Por favor, preencha o nome.');
        }
    });
});
