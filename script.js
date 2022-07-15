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

const createExpenseHTML = (expense) => {
  let expensesTotal = 0;

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
    totalAmount.textContent = `Total: $${expensesTotal}`;

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

const render = async () => {
  const fetchedData = await fetchWithoutBody('GET');
  const fetchedExpenses = await fetchedData.json();
  createExpenseHTML(fetchedExpenses);
};

window.onload = () => {
  render();
};
