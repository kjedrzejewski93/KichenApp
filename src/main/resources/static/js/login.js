document.addEventListener("DOMContentLoaded", function() {
    checkAuth();
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        showWelcomePage(user.username, user.admin);
    }
}

function register(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password}),
    })
        .then(response => response.text())
        .then(data =>{
        document.getElementById('message').textContent = data;
        //Czyszczenie pól po wpisaniu loginu i hasła
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    })
        .catch(error =>{
        console.error('Error: ', error);
        document.getElementById('message').textContent = 'Błąd';
    });
}

function login(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => {
        if(response.ok){
            return response.json();
        } else{
            throw new Error("Błędny login lub hasło");
        }
    })
        .then(data => {
        console.log(data);
        document.getElementById('message').textContent = data.message;
        localStorage.setItem('user', JSON.stringify(data)); // Zapisuje cały obiekt danych użytkownika
        showWelcomePage(username);
    })
        .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'Błąd';
    });
}

function showWelcomePage(username, isAdmin){
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User data from localStorage:', user);
    if (user) {
        document.querySelector('.container').style.display = 'none';
        document.getElementById('welcomePage').style.display = 'block';
        document.getElementById('welcomeMessage').textContent = 'Witaj, ' + username + '!';

        if (user.admin) {
            document.getElementById('usersButton').style.display = 'block';
            document.getElementById('panelTitle').textContent = 'Admin Panel';
        } else {
            document.getElementById('usersButton').style.display = 'none';
            document.getElementById('panelTitle').textContent = 'User Panel';
        }
    } else {
        document.getElementById('message').textContent = "Brak uprawnień";
    }
}

function showAdminButtonsPage(){
    document.getElementById('buttonsPanel').style.display = 'none';
    document.getElementById('backButton').style.display = 'block';
    document.getElementById('supplierForm').style.display = 'none';
    document.getElementById('adminButtonsPage').style.display = 'block';
}


function logout(){
    fetch('/api/auth/logout', {method: 'POST'})
        .then(() =>{
        localStorage.removeItem('user');
        document.querySelector('.container').style.display = 'block';
        document.getElementById('welcomePage').style.display = 'none';
        document.getElementById('addSupplierForm').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('message').textContent = '';
        document.getElementById('order').style.display = 'none';
    })
        .catch(error =>{
        console.error('Błąd: ', error);
    })
}