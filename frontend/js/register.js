const backendUrl = 'http://localhost:3000/api';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${backendUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Usuário registrado com sucesso! Você pode fazer login agora.');
            window.location.href = 'login.html'; // Redireciona para a página de login
        } else {
            document.getElementById('errorMessage').innerText = data.message;
        }
    } catch (error) {
        document.getElementById('errorMessage').innerText = 'Erro ao registrar. Tente novamente.';
        console.error('Erro:', error);
    }
});
