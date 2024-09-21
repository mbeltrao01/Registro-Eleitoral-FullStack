const apiUrl = 'http://localhost:3000/api/eleitores';

// Função para buscar os eleitores (rota protegida)
async function fetchEleitores() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token não encontrado, redirecionando para a página de login.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`, // Envia o token JWT
            },
        });

        if (!response.ok) {
            throw new Error('Falha na autenticação. Redirecionando para login.');
        }

        const eleitores = await response.json();
        const eleitorList = document.getElementById('eleitorList');
        eleitorList.innerHTML = '';

        eleitores.forEach(eleitor => {
            const li = document.createElement('li');

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'details';
            detailsDiv.innerHTML = `
                <span><strong>Nome:</strong> ${eleitor.nome}</span>
                <span><strong>Título:</strong> ${eleitor.etitulo}</span>
                <span><strong>Já votou:</strong> ${eleitor.vote ? 'Sim' : 'Não'}</span>
                ${eleitor.foto ? `<img src="${eleitor.foto}" alt="Foto" width="200">` : ''} <!-- Mostra a foto se disponível -->
            `;
            li.appendChild(detailsDiv);

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteEleitor(eleitor._id);
            buttonGroup.appendChild(deleteButton);

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => updateEleitor(eleitor);
            buttonGroup.appendChild(editButton);

            li.appendChild(buttonGroup);
            eleitorList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar eleitores:', error);
        window.location.href = 'login.html';
    }
}

// Função para adicionar eleitores (rota protegida)
async function addEleitor(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const etitulo = document.getElementById('etitulo').value;
    const vote = document.getElementById('vote').checked;
    const fotoInput = document.getElementById('foto');
    let foto = null;

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token não encontrado. Redirecionando para login.');
        window.location.href = 'login.html';
        return;
    }

    if (fotoInput.files.length > 0) {
        const file = fotoInput.files[0];
        const reader = new FileReader();

        reader.onloadend = async () => {
            foto = reader.result;
            await saveEleitor(nome, etitulo, vote, foto, token);
        };

        reader.readAsDataURL(file);
    } else {
        await saveEleitor(nome, etitulo, vote, null, token);
    }
}

// Função para salvar eleitor
async function saveEleitor(nome, etitulo, vote, foto, token) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envia o token JWT
            },
            body: JSON.stringify({ nome, etitulo, vote, foto })
        });

        if (response.ok) {
            fetchEleitores();
            document.getElementById('eleitorForm').reset();
        } else {
            console.error('Erro ao adicionar eleitor');
        }
    } catch (error) {
        console.error('Erro ao adicionar eleitor:', error);
    }
}

// Função para excluir um eleitor (rota protegida)
async function deleteEleitor(id) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token não encontrado. Redirecionando para login.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Envia o token JWT
            },
        });

        if (response.ok) {
            fetchEleitores(); // Atualiza a lista de eleitores
        } else {
            console.error('Erro ao excluir eleitor');
        }
    } catch (error) {
        console.error('Erro ao excluir eleitor:', error);
    }
}

// Função para atualizar um eleitor
function updateEleitor(eleitor) {
    const nome = prompt("Insira o novo nome:", eleitor.nome);
    const etitulo = prompt("Insira o novo título eleitoral:", eleitor.etitulo);
    
    // Pergunta se já votou
    const voteResponse = prompt("Digite 'sim' se já votou ou 'não' se não votou:", "não").toLowerCase();
    const vote = (voteResponse === 'sim');

    // Verifica se o usuário não cancelou o prompt
    if (nome !== null && etitulo !== null) {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token não encontrado. Redirecionando para login.');
            window.location.href = 'login.html';
            return;
        }

        // Mantém a foto existente
        const foto = eleitor.foto;

        fetch(`${apiUrl}/${eleitor._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome, etitulo, vote, foto })
        })
        .then(response => {
            if (response.ok) {
                fetchEleitores(); // Atualiza a lista de eleitores
                alert('Eleitor atualizado com sucesso!'); // Caixa de aviso
            } else {
                alert('Erro ao atualizar eleitor.'); // Caixa de aviso
                console.error('Erro ao atualizar eleitor:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar eleitor:', error);
        });
    }
}

// Chamar fetchEleitores() para listar eleitores protegidos por autenticação
document.getElementById('eleitorForm').addEventListener('submit', addEleitor);
fetchEleitores();
