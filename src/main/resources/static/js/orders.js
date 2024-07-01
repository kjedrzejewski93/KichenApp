console.log('orders.js loaded')


document.addEventListener('DOMContentLoaded', (event) => {
    updatePanelTitle();
    init();
    const orderList = document.getElementById('orderList');
    const order = JSON.parse(localStorage.getItem('order')) || [];

    order.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.productName} ${item.quantity} ${item.unit}`;
        orderList.appendChild(listItem);
    });
});


function init() {
    loadSuppliers();
}

async function loadProducets(){
    try {
        const response = await fetch('http://localhost:8081/api/suppliers');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Response is not an array');
        }

        const supplierList = document.getElementById('supplierList').querySelector('tbody');
        supplierList.innerHTML = ''; // Clear any existing content

        data.forEach(supplier => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.productCount}</td>
      <td>
        <button id="checkAvButton" onclick="showProduct(${supplier.id})">Sprawdź dostępne produkty</button>
      </td>
            `;
            supplierList.appendChild(tr);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadSuppliers() {
    try {
        const response = await fetch('http://localhost:8081/api/suppliers');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Response is not an array');
        }

        const supplierList = document.getElementById('supplierList').querySelector('tbody');
        supplierList.innerHTML = ''; // Clear any existing content

        data.forEach(supplier => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.productCount}</td>
                  <td>
                    <button onclick="showProducts(${supplier.id})">Dodaj Produkty</button>
                    <button onclick="deleteSupplier(${supplier.id})">Usuń Dostawcę</button>
                  </td>
            `;
            supplierList.appendChild(tr);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function showProducents(){
    document.getElementById('buttonsPanel').style.display = 'none';
    document.getElementById('backButton').style.display = 'block';
    document.getElementById('addSupplierForm').style.display = 'block';
    document.getElementById('supplierForm').style.display = 'none';
    loadProducets();
}

function showSuppliers() {
    document.getElementById('buttonsPanel').style.display = 'none';
    document.getElementById('addSupplierForm').style.display = 'block';
    document.getElementById('backButton').style.display = 'block';
    document.getElementById('productList').style.display = 'none';
    document.getElementById('supplierForm').style.display = 'block';
    loadSuppliers();
}

async function showProduct(supplierId){
    try {
        console.log(`Fetching products for supplierId: ${supplierId}`);
        localStorage.setItem('supplierId', supplierId);
        const response = await fetch(`http://localhost:8081/api/products/supplier/${supplierId}`);
        console.log(`Received response:`, response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        console.log(`Received products:`, products);

        const productsToBuyTable = document.getElementById('productsToBuyTable').querySelector('tbody');
        productsToBuyTable.innerHTML = '';

        products.forEach(product => {
            const productRow = document.createElement('tr');
            productRow.innerHTML = `
                <td id="name-${product.name}">${product.name}</td>
                <td><input type="text" id="unit-${product.id}" placeholder="Jednostka"></td>
                <td><input type="number" id="quantity-${product.id}" placeholder="Ilość"></td>
                <td>
                    <button onclick="addProductToOrder(${product.id}, '${product.name}')">Dodaj</button>
                    <button onclick="removeProductFromOrder(${product.id})">Usuń</button>
                </td>
            `;
            productsToBuyTable.appendChild(productRow);
        });
        document.getElementById('suppliersList').style.display = 'none'; // ZMIANA: Ukrycie listy dostawców
        document.getElementById('addProductToBuyForm').style.display = 'block'; // ZMIANA: Pokazanie formularza dodawania produktów do zakupu
        document.getElementById('addSupplierForm').style.display = 'none';
    } catch (error) {
        console.error('Error fetching products:', error);
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = `Błąd: ${error.message}`;
        }
    }
}

async function showProducts(supplierId) {
    try {
        console.log(`Fetching products for supplierId: ${supplierId}`);
        localStorage.setItem('supplierId', supplierId);
        const response = await fetch(`http://localhost:8081/api/products/supplier/${supplierId}`);
        console.log(`Received response:`, response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        console.log(`Received products:`, products);

        const productsTableBody = document.getElementById('productsTable').querySelector('tbody');
        productsTableBody.innerHTML = '';

        products.forEach(product => {
            const productRow = document.createElement('tr');
            productRow.innerHTML = `
                <td>${product.name}</td>
                <td>${product.unit}</td>
                <td>
                    <button onclick="orderProduct(${product.id})">Zamów</button>
                </td>
            `;
            productsTableBody.appendChild(productRow);
        });

        const suppliersList = document.getElementById('suppliersList');
        const addProductForm = document.getElementById('addProductForm');
//        const productsList = document.getElementById('productsList');
        const addSupplierForm = document.getElementById('addSupplierForm');
        const backToSuppliersButton = document.getElementById('backToSuppliersButton');

        if (suppliersList) {
            suppliersList.style.display = 'block';
        }
        if (addProductForm) {
            addProductForm.style.display = 'block';
        }
        if (addSupplierForm) {
            addSupplierForm.style.display = 'none';
        }
//        if (productsList) {
//            productsList.style.display = 'block';
//        }
        if (backToSuppliersButton) {
            backToSuppliersButton.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = `Błąd: ${error.message}`;
        }
    }
}

async function addProductToOrder(productId, productName) {
    const unit = document.getElementById(`unit-${productId}`).value;
    const quantity = document.getElementById(`quantity-${productId}`).value;

    if (!unit || !quantity) {
        alert('Proszę wprowadzić jednostkę i ilość.');
        return;
    }

    const orderItem = {
        productId: productId,
        productName: productName,
        unit: unit,
        quantity: parseInt(quantity, 10)
    };

    try {
        const response = await fetch('http://localhost:8081/api/orders/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderItem),
        });

        if (!response.ok) {
            throw new Error('Błąd przy dodawaniu produktu do zamówienia');
        }

        const data = await response.json();
        console.log('Produkt dodany do zamówienia.');

        // Add item to local storage
        let order = JSON.parse(localStorage.getItem('order')) || [];
        order.push(orderItem);
        localStorage.setItem('order', JSON.stringify(order));

//        alert('Produkt dodany do zamówienia.');

        // Update the order list in the popup
        const orderList = document.getElementById('orderList');
        const listItem = document.createElement('li');
        listItem.textContent = `${orderItem.productName} ${orderItem.quantity} ${orderItem.unit}`;
        orderList.appendChild(listItem);
    } catch (error) {
        console.error('Error:', error);
    }
}

function removeProductFromOrder(productId) {
    let order = JSON.parse(localStorage.getItem('order')) || [];
    order = order.filter(product => product.productId !== productId);
    localStorage.setItem('order', JSON.stringify(order));

    // Update the order list in the popup
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
    order.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.productName} ${item.quantity} ${item.unit}`;
        orderList.appendChild(listItem);
    });

    alert('Produkt usunięty z zamówienia.');
}

function loadSuppliersForUser() {
    fetch('http://localhost:8081/api/suppliers')
        .then(response => response.json())
        .then(data => {
        const supplierListUser = document.getElementById('supplierListUser');
        supplierListUser.innerHTML = '';
        data.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${supplier.name}</td><td>${supplier.productCount}</td><td><button onclick="viewProducts(${supplier.id})">Zobacz Produkty</button></td>`;
            supplierListUser.appendChild(row);
        });
    })
        .catch(error => {
        console.error('Error:', error);
        alert('Błąd przy ładowaniu dostawców');
    });
}

function deleteSupplier(supplierId) {
    fetch(`http://localhost:8081/api/suppliers/${supplierId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
        if (response.ok) {
            alert('Dostawca usunięty!');
            loadSuppliers();
        } else {
            return response.json().then(data => { throw new Error(data.message); });
        }
    })
        .catch(error => {
        console.error('Error:', error);
        alert('Błąd przy usuwaniu dostawcy');
    });
}

function viewProducts(supplierId) {
    fetch(`http://localhost:8081/api/suppliers/${supplierId}/products`)
        .then(response => response.json())
        .then(data => {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        data.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${product.name}</td><td>${product.unit}</td><td>${product.price}</td><td><input type="number" placeholder="Quantity" id="quantity-${product.id}"><button onclick="addToOrder(${product.id})">Add to Order</button></td>`;
            productList.appendChild(row);
        });
    })
        .catch(error => {
        console.error('Error:', error);
        alert('Błąd przy ładowaniu produktów');
    });
}

function loadProductsBySupplier(supplierId){
    fetch(`http://localhost:8081/api/products/supplier/${supplierId}`)
        .then(response => response.json())
        .then(products => {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.innerHTML =`
                    <div>${product.name} (${product.unit}) - ${product.price} PLN</div>
                    <input type="number" placeholder="Ilość" />
                `;
            productList.appendChild(productItem);
        });
    })
        .catch(error => {
        console.error('Error: ', error);
        document.getElementById('message').textContent = "Bład przy ładowaniu produktów";
    })
}//

function orderProduct(productId) {
    // Implementacja zamawiania produktu - można dodać formularz zamówienia
    console.log(`Zamówiono produkt o ID: ${productId}`);
}//

async function addToOrder(item) {
    try {
        console.log('Adding product to order:', product);
        const response = await fetch('http://localhost:8081/api/orders/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Product added to order:', data);
    } catch (error) {
        console.error('Error adding product to order:', error);
    }
}

function showAddProductForm(supplierId) {
    document.getElementById('addSupplierForm').style.display = 'none';
    document.getElementById('addProductForm').style.display = 'block';
}

//async function goToOrder() {
//    console.log('Going to order');
//    document.getElementById('order').style.display = 'block';
//    document.getElementById('addProductToBuyForm').style.display = 'none';
//    try {
//        const response = await fetch('http://localhost:8081/api/orders');
//        if (!response.ok) {
//            throw new Error('Błąd przy pobieraniu zamówienia');
//        }
//
//        const order = await response.json();
//        const orderList = order.map(item => `${item.productName} ${item.quantity} ${item.unit}`).join('\n');
//        alert(`Twoje zamówienie:\n${orderList}`);
//
//        const submitResponse = await fetch('http://localhost:8081/api/orders/submit', {
//            method: 'POST',
//        });
//
//        if (!submitResponse.ok) {
//            throw new Error('Błąd przy przesyłaniu zamówienia');
//        }
//
//        alert('Zamówienie zostało przesłane.');
//    } catch (error) {
//        console.error('Error:', error);
//        alert('Błąd przy generowaniu zamówienia');
//    }
//
//
//}


async function goToOrder() {
    console.log('Going to order');
    const order = JSON.parse(localStorage.getItem('order'));

    if (!order || order.length === 0) {
        alert('Zamówienie jest puste.');
        return;
    }

    const orderList = order.map(item => `${item.productName} - ${item.quantity} ${item.unit}`).join('\n');
//    alert(`Twoje zamówienie:\n${orderList}`);
    console.log(`Twoje zamówienie:\n${orderList}`);

    document.getElementById('order').style.display = 'block'; // Pokazanie sekcji zamówienia
    document.getElementById('addProductToBuyForm').style.display = 'none'; // Ukrycie formularza dodawania produktów

//    try {
//        const submitResponse = await fetch('http://localhost:8081/api/orders/submit', {
//            method: 'POST',
//        });
//
//        if (!submitResponse.ok) {
//            throw new Error('Błąd przy przesyłaniu zamówienia');
//        }
//
//        alert('Zamówienie zostało przesłane.');
//    } catch (error) {
//        console.error('Error:', error);
//        alert('Błąd przy generowaniu zamówienia');
//    }
}



function addSupplier() {
    const supplierName = document.getElementById('supplierName').value;

    fetch('http://localhost:8081/api/suppliers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: supplierName }),
    })
        .then(response => response.json())
        .then(data => {
        console.log('Added supplier:', data);
        loadSuppliers();
    })
        .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'Błąd przy dodawaniu dostawcy';
    });
}

function getSupplierIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('supplierId');
}

function addProduct() {
    const supplierId = localStorage.getItem('supplierId');
    //    const supplierId = document.getElementById('supplierSelect').value;
    console.log('Supplier ID:', supplierId);
    const productName = document.getElementById('productName').value;
    const productUnit = document.getElementById('productUnit').value;
    const productPrice = document.getElementById('productPrice').value;

    fetch(`http://localhost:8081/api/suppliers/${supplierId}/products`, {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: productName,
            unit: productUnit,
            price: parseFloat(productPrice),
        }),
    })
        .then(response => response.json())
        .then(data => {
        alert('Produkt dodany!');
        document.getElementById('productName').value = '';
        document.getElementById('productUnit').value = '';
        document.getElementById('productPrice').value = '';
        loadSuppliers();
    })
        .catch(error => {
        console.error('Error:', error);
        alert('Błąd przy dodawaniu produktu');
    });
}

function updateProductCount(supplierId) {
    fetch(`http://localhost:8081/api/suppliers/${supplierId}`)
        .then(response => response.json())
        .then(data => {
        document.getElementById(`productCount-${supplierId}`).textContent = data.productCount;
    })
        .catch(error => {
        console.error('Error:', error);
        alert('Błąd przy aktualizacji liczby produktów');
    });
}//

//async function submitOrder() {
//    console.log('Submitting order');
//    const supplierId = localStorage.getItem('supplierId');
//    const order = JSON.parse(localStorage.getItem('order'));
//
//    if (!order || order.length === 0) {
//        alert('Zamówienie jest puste.');
//        return;
//    }
//
//    try {
//        const response = await fetch(`http://localhost:8081/api/orders`, {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'application/json',
//            },
//            body: JSON.stringify({ supplierId, order }),
//        });
//
//        if (!response.ok) {
//            throw new Error(`HTTP error! Status: ${response.status}`);
//        }
//
//        alert('Zamówienie złożone pomyślnie.');
//        localStorage.removeItem('order');
//        localStorage.removeItem('supplierId');
//
//        document.getElementById('order').style.display = 'none';
//        document.getElementById('suppliersList').style.display = 'block';
//    } catch (error) {
//        console.error('Error submitting order:', error);
//    }
//}


async function submitOrder() {
    const order = JSON.parse(localStorage.getItem('order')) || [];

    if (order.length === 0) {
        alert('Zamówienie jest puste.');
        return;
    }

    const supplierId = localStorage.getItem('supplierId');
    if (!supplierId) {
        alert('Nie wybrano dostawcy.');
        return;
    }

    const orderData = {
        supplierId: supplierId,
        orderItems: order
    };

    try {
        const response = await fetch('http://localhost:8081/api/orders/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        console.log('Odpowiedź serwera przed parsowaniem:', response);

        if (!response.ok) {
            throw new Error('Błąd przy składaniu zamówienia');
        }

        const responseData = await response.text(); // Odczytaj odpowiedź jako tekst

        console.log('Tekstowa odpowiedź serwera:', responseData);

        // Sprawdź, czy odpowiedź jest tekstem informującym o sukcesie
        if (responseData.includes('Order submitted successfully')) {
            console.log('Zamówienie złożone pomyślnie.');
            localStorage.removeItem('order');
            localStorage.removeItem('supplierId');
            alert('Zamówienie zostało złożone pomyślnie.');
        } else {
            console.error('Otrzymano nieprawidłową odpowiedź tekstową od serwera.');
            alert('Otrzymano nieprawidłową odpowiedź tekstową od serwera.');
        }

    } catch (error) {
        console.error('Error submitting order:', error);
        alert('Błąd przy składaniu zamówienia.');
    }
}






















