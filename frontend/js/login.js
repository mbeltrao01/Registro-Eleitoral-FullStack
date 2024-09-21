const backendUrl = 'http://localhost:3000/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${backendUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Armazenar o token no localStorage
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html'; // Redirecionar para a página principal
        } else {
            document.getElementById('errorMessage').innerText = data.message;
        }
    } catch (error) {
        document.getElementById('errorMessage').innerText = 'Erro no login. Tente novamente.';
        console.error('Erro:', error);
    }
});
