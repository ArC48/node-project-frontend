/* eslint-disable no-use-before-define */
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

// delete existing expense by ID
const deleteExpense = async (id) => {
  try {
    if (id) {
      const fetchDelete = await fetchWithoutBody('DELETE', id);
      const expensesList = await fetchDelete.json();
      createExpenseHTML(expensesList);
    } else {
      const err = document.getElementById('errors');
      err.innerText = 'wrong ID, try existing one!';
    }
  } catch (err) {
    document.getElementById('errors').style.display = 'block';
    document.getElementById('errors').innerText = err;
  }
};

const createExpenseHTML = (expense) => {
  let expensesTotal = 0;
  const expensesContainer = document.querySelector('.orderedList');
  expensesContainer.innerHTML = '';
  const errors = document.getElementById('errors');
  errors.style.display = 'none';

  if (!expense.length) {
    document.getElementById('errors').style.display = 'block';
    document.getElementById('errors').innerText = 'No Expenses in the container!';
    document.getElementById('totalAmountId').innerText = 'Total: $0';
  }

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
    const listItemsDiv = document.createElement('div');
    const listItem = document.createElement('p');
    const storeName = document.createElement('p');
    const dateElement = document.createElement('p');
    const priceElement = document.createElement('p');
    const dollarSign = document.createElement('span');

    const iconsDiv = document.createElement('div');
    const datePriceDiv = document.createElement('div');

    // input elements while in an editing state
    const nameInput = document.createElement('input');
    const priceInput = document.createElement('input');
    const confirmIcon = document.createElement('i');
    const cancelIcon = document.createElement('i');

    // icons
    const editButtonIcon = document.createElement('i');
    const deleteButtonIcon = document.createElement('i');

    // assigning classes to elements
    listItems.className = 'listItemClass';
    listItemsDiv.className = 'listItemsClassDiv';
    listItem.className = 'list-item';
    storeName.className = 'store-name';
    dateElement.className = 'date';
    priceElement.className = 'price';
    dollarSign.className = 'dollar-sign';
    editButtonIcon.className = 'fa-solid fa-pencil edit icon';
    deleteButtonIcon.className = 'fa-solid fa-trash delete icon';
    confirmIcon.className = 'fa-solid fa-check confirm-button';
    cancelIcon.className = 'fa-solid fa-times cancel-button';

    iconsDiv.className = 'icons-div';
    datePriceDiv.className = 'date-price-div';

    // titles on buttons
    editButtonIcon.title = 'edit element';
    deleteButtonIcon.title = 'delete element';
    confirmIcon.title = 'confirm change';
    cancelIcon.title = 'cancel change';

    // assigning values to elements from the API
    storeName.innerText = text;
    dateElement.innerText = updatedAt;
    priceElement.innerText = `${price}`;
    dollarSign.innerText = `$${price}`;
    priceInput.type = 'number';

    iconsDiv.append(
      confirmIcon,
      editButtonIcon,
      cancelIcon,
      deleteButtonIcon,
    );

    datePriceDiv.append(
      dateElement,
      dollarSign,
      priceInput,
      iconsDiv,
    );

    orderedList.append(listItemsDiv);
    listItems.append(
      storeName,
      nameInput,
      datePriceDiv,
    );

    listItemsDiv.append(listItems);

    nameInput.style.display = 'none';
    priceInput.style.display = 'none';
    confirmIcon.style.display = 'none';
    cancelIcon.style.display = 'none';

    // click events
    deleteButtonIcon.addEventListener('click', () => {
      deleteExpense(id);
    });

    cancelIcon.addEventListener('click', () => {
      createExpenseHTML(expense);
    });

    confirmIcon.addEventListener('click', () => {
      const confirmedExpense = {
        storeName,
        priceElement,
        nameInput,
        priceInput,
        id,
      };
      confirmEditExpense(confirmedExpense);
    });

    editButtonIcon.addEventListener('click', () => {
      const validFields = {
        storeName,
        nameInput,
        priceInput,
        priceElement,
        dollarSign,
        dateElement,
        confirmIcon,
        cancelIcon,
        editButtonIcon,
        deleteButtonIcon,
        id,
      };
      editElement(validFields);
    });
  });
};

const editElement = (fields) => {
  const fieldsStore = fields;
  // name input
  fieldsStore.nameInput.value = fieldsStore.storeName.innerText;
  fieldsStore.nameInput.style.display = 'inline-block';
  fieldsStore.nameInput.className = 'name-input';
  fieldsStore.storeName.style.display = 'none';

  // price input
  fieldsStore.priceInput.value = fieldsStore.priceElement.innerText;
  fieldsStore.priceInput.style.display = 'inline-block';
  fieldsStore.priceElement.style.display = 'none';
  fieldsStore.dollarSign.style.display = 'none';

  // date element
  fieldsStore.dateElement.className = 'response-date';

  // confirm button
  fieldsStore.confirmIcon.style.display = 'inline-block';
  fieldsStore.editButtonIcon.style.display = 'none';

  // cancel button
  fieldsStore.cancelIcon.style.display = 'inline-block';
  fieldsStore.deleteButtonIcon.style.display = 'none';
};

// POST request logic
const expenseSampleCreate = async () => {
  const storeInput = document.getElementById('storeInput');
  const priceInput = document.getElementById('priceInput');
  const errorTexts = document.getElementById('errorsCreate');
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
    setTimeout(() => {
      errorTexts.style.display = 'none';
    }, 5000);
    errors.forEach((err) => {
      errorTexts.style.display = 'block';
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

const confirmEditExpense = async (confirmedExpense) => {
  const {
    storeName,
    priceElement,
    nameInput,
    priceInput,
    id,
  } = confirmedExpense;

  const text = nameInput.value;
  const price = Number(priceInput.value);

  // validations & error handling
  const errors = document.getElementById('errors');
  const errorsContainer = [];
  errors.innerHTML = '';

  if (!text || !price) {
    if (Number(price) !== 0) errorsContainer.push('Invalid Inputs, try valid values!');
  }

  if (Number.isNaN(price) || Number(price) < 0 || Number(price) === 0) errorsContainer.push('Invalid price, must be a positive number');
  if (text === storeName.innerText && price === Number(priceElement.innerText)) errorsContainer.push('you have to change at least one input field');
  if (errorsContainer.length) {
    errors.style.display = 'inline-block';
    errorsContainer.forEach((err) => {
      errors.innerHTML += `<li>${err}</li>`;
    });
  } else if (id) {
    try {
      const result = await fetchWithBody('PATCH', {
        text,
        price,
      }, id);

      const expense = await result.json();
      createExpenseHTML(expense);
    } catch (err) {
      errors.innerHTML = `<li>${err}</li>`;
    }
  } else {
    errors.innerHTML = '<li>Invalid ID!</li>';
  }
};

const render = async () => {
  const addButton = document.getElementById('addButton');
  addButton.addEventListener('click', expenseSampleCreate);

  const fetchedData = await fetchWithoutBody('GET');
  const fetchedExpenses = await fetchedData.json();

  createExpenseHTML(fetchedExpenses);
};

window.onload = () => {
  render();
};
