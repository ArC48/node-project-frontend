const apiBaseUrl = 'http://localhost:4000/expenses';

// headers info
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// fetch function without body
const fetchWithoutBody = async (method, id) => {
  const hasId = id ? `${apiBaseUrl}/${id}` : apiBaseUrl;
  return fetch(hasId, {
    method,
    headers,
  });
};

// fetch function with body
const fetchWithBody = async (method, body, id) => {
  const hasId = id ? `${apiBaseUrl}/${id}` : apiBaseUrl;
  return fetch(hasId, {
    method,
    headers,
    body: JSON.stringify(body),
  });
};

const createExpenseHTML = (expense) => {
  let expensesTotal = 0;
  const expensesContainer = document.querySelector('.orderedList');
  expensesContainer.innerHTML = '';

  expense.forEach((eachExpense) => {
    const {
      id,
      text,
      price,
      updatedAt,
    } = eachExpense;
    expensesTotal += Number(price);

    const totalAmount = document.getElementById('totalAmountId');
    const orderedList = document.querySelector('.orderedList');
    totalAmount.textContent = `Total: $${expensesTotal.toFixed(2)}`;

    // create block for the list items
    const listItems = document.createElement('li');
    const listItem = document.createElement('p');
    const storeName = document.createElement('p');
    const dateElement = document.createElement('p');
    const priceElement = document.createElement('p');

    // icons
    const editButtonIcon = document.createElement('i');
    const deleteButtonIcon = document.createElement('i');

    // assigning classes to elements
    listItems.className = 'listItemClass';
    listItem.className = 'list-item';
    storeName.className = 'store-name';
    dateElement.className = 'date';
    priceElement.className = 'price';
    editButtonIcon.className = 'fa-solid fa-pencil edit icon';
    deleteButtonIcon.className = 'fa-solid fa-trash delete icon';

    // assigning values to elements from the API
    storeName.innerText = text;
    dateElement.innerText = updatedAt;
    priceElement.innerText = `$${price}`;

    orderedList.append(listItems);
    listItems.append(storeName, dateElement, priceElement, editButtonIcon, deleteButtonIcon);
  });
};

// POST request logic
const expenseSampleCreate = async () => {
  const storeInput = document.getElementById('storeInput');
  const priceInput = document.getElementById('priceInput');
  const errorTexts = document.getElementById('errors');
  errorTexts.innerText = '';
  const errors = [];

  if (Number(priceInput.value) === 0) {
    errors.push('Price can\'t be 0');
  }
  if (!storeInput.value || !priceInput.value) {
    errors.push('Input Fields Can\'t be Empty!');
  }
  if (Number.isNaN(Number(priceInput.value))) {
    errors.push('Price must be a Number!');
  }
  if (priceInput.value < 0) {
    errors.push('Price must be a positive number!');
  }

  if (errors.length) {
    errors.forEach((err) => {
      errorTexts.innerHTML += `<li>${err}</li>`;
    });
  } else {
    try {
      const result = await fetchWithBody('POST', {
        text: storeInput.value,
        price: Number(priceInput.value),
      });

      const expense = await result.json();
      createExpenseHTML(expense);

      storeInput.value = '';
      priceInput.value = '';
    } catch (err) {
      errors.style.display = 'block';
      errors.innerHTML = `<li>${err}</li>`;
    }
  }
};

const render = async () => {
  const addButton = document.getElementById('addButton');
  addButton.addEventListener('click', expenseSampleCreate);

  const fetchedData = await fetchWithoutBody('GET');
  const fetchedExpenses = await fetchedData.json();

  if (fetchedExpenses.length) {
    createExpenseHTML(fetchedExpenses);
  } else {
    document.getElementById('errors').style.display = 'block';
    document.getElementById('errors').innerText = 'No Expenses in the container!';
    document.getElementById('totalAmountId').innerText = 'Total: $0';
    createExpenseHTML(fetchedExpenses);
  }
};

window.onload = () => {
  render();
};
