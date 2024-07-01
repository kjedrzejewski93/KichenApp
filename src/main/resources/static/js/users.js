function showUsers(){
    document.getElementById('buttonsPanel').style.display = 'none';
    document.getElementById('userList').style.display = 'block';
    document.getElementById('backButton').style.display = 'block';
    document.getElementById('usersButton').style.display = 'none';
    getUsers();
}

function showAdminPanel() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('welcomePage').style.display = 'block';
    document.getElementById('panelTitle').textContent = 'Portal Administratora';
    document.getElementById('usersButton').style.display = 'block';
    document.getElementById('suppliersButton').style.display = 'block';
    document.getElementById('ordersToByButton').style.display = 'block';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('userSuppliers').style.display = 'none';
    document.getElementById('addSupplierForm').style.display = 'none';
    document.getElementById('addProductForm').style.display = 'none';
}

function showUserPanel() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('welcomePage').style.display = 'block';
    document.getElementById('panelTitle').textContent = 'Panel użytkownika';
    document.getElementById('usersButton').style.display = 'none';
    document.getElementById('suppliersButton').style.display = 'block';
    document.getElementById('ordersToByButton').style.display = 'block';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('userSuppliers').style.display = 'block';
    loadSuppliersForUser();
}

function getUsers(){
    if(isAdmin()){
        fetch('http://localhost:8081/api/auth/users')
            .then(response => response.json())
            .then(users =>{
            const userList = document.getElementById('userList');
            userList.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Admin</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            `;
            const tbody = userList.querySelector('tbody');
            users.forEach(user =>{
                const userItem = document.createElement('tr');
                userItem.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.password}</td>
                    <td>${user.admin ? 'Yes' : 'No'}</td>
                    <td>
                        <button onclick="toggleAdminStatus(${user.id})">
                            ${user.admin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                    </td>
                `;
                tbody.appendChild(userItem);

            });
        })
            .catch(error =>{
            console.error('Error: ' + error);
            document.getElementById('message').textContent = 'Bład';
        });
    }
}

function updatePanelTitle() {
    const isAdminPanel = isAdmin();
    const panelTitle = document.getElementById('panelTitle');
    panelTitle.textContent = isAdminPanel ? 'Panel Administratora' : 'Panel Użytkownika';
}

function toggleAdminStatus(userId){
    fetch(`http://localhost:8081/api/auth/users/${userId}/toggle-admin`, {
        method: 'POST'
    })
        .then(response => response.text())
        .then(data =>{
        console.log(data);
        getUsers();
    })
        .catch(error=>{
        console.error('Error: ', error);
        document.getElementById('message').textContent = 'Błąd';
    })
}

function isAdmin(){
    const userString = localStorage.getItem('user');
    if(userString) {
        const user = JSON.parse(userString);
        return user && user.admin;
    } else {
        return false;
    }
}