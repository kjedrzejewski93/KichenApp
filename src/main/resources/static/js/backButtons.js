function goBack() {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user ? user.username : 'Gość';
    const isAdmin = user ? user.admin : false;

    showWelcomePage(username, isAdmin);

    document.getElementById('userList').style.display = 'none';
    document.getElementById('buttonsPanel').style.display = 'block';
    document.getElementById('addSupplierForm').style.display = 'none';
    document.getElementById('addProductForm').style.display = 'none';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('userSuppliers').style.display = 'none';
//    document.getElementById('productsList').style.display = 'none';
    document.getElementById('addProductToBuyForm').style.display = 'none';
    document.getElementById('order').style.display = 'none';
}

function goBackToSuppliers() {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user ? user.username : 'Gość';
    const isAdmin = user ? user.admin : false;

    showWelcomePage(username, isAdmin);

    document.getElementById('buttonsPanel').style.display = 'none';
    document.getElementById('addSupplierForm').style.display = 'block';
    document.getElementById('backButton').style.display = 'block';
//    document.getElementById('productsList').style.display = 'none';
    document.getElementById('addProductForm').style.display = 'none';
    document.getElementById('addProductToBuyForm').style.display = 'none';
    document.getElementById('order').style.display = 'none';
    loadSuppliers();
}

function goBackFromBuying(){
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user ? user.username : 'Gość';
    const isAdmin = user ? user.admin : false;

    showWelcomePage(username, isAdmin);

    document.getElementById('buttonsPanel').style.display = 'none';
    document.getElementById('addSupplierForm').style.display = 'none';
    document.getElementById('backButton').style.display = 'block';
    //    document.getElementById('productsList').style.display = 'none';
    document.getElementById('addProductForm').style.display = 'none';
    document.getElementById('addProductToBuyForm').style.display = 'none';
    document.getElementById('order').style.display = 'none';
    loadSuppliers();
}

//function goBackFromProducts() {
//    document.getElementById('addProductForm').style.display = 'none';
//    document.getElementById('buttonsPanel').style.display = 'block';
//    document.getElementById('backButtonProduct').style.display = 'none';
//}

function goBackFromUser() {
    document.getElementById('userSuppliers').style.display = 'none';
    document.getElementById('buttonsPanel').style.display = 'block';
    document.getElementById('backButtonUser').style.display = 'none';
}

//function backToSuppliers() {
//    document.getElementById('addProductForm').style.display = 'none';
//    document.getElementById('supplierList').style.display = 'block';
//    document.getElementById('backButton').style.display = 'block';
//}