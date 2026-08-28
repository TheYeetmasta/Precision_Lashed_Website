const BASE_VISIT_FEE = 80;
const PRICE_PER_SQ_M = 2.5;

class Quote {
  constructor(id, customerName, jobType, area, extras, status = "New") {
    this.id = id;
    this.customerName = customerName;
    this.jobType = jobType;
    this.area = area;
    this.extras = extras;
    this.status = status;
  }

  calculateTotal() {
    const extrasTotal = this.extras.reduce(
      (total, extra) => total + extra.price,
      0
    );

    return BASE_VISIT_FEE + (this.area * PRICE_PER_SQ_M) + extrasTotal;
  }
}

function saveQuotes(quotes) {
  localStorage.setItem("businessQuotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const savedQuotes = localStorage.getItem("businessQuotes");

  if (!savedQuotes) {
    return [];
  }

  return JSON.parse(savedQuotes);
}

function displayQuotes(quotes) {
  const quoteList = document.querySelector("#quoteList");
  quoteList.innerHTML = "";

  quotes.forEach((quote) => {
    const card = document.createElement("article");
    card.className = "quote-card";

    card.innerHTML = `
      <h3>${quote.customerName}</h3>
      <p>Service: ${quote.jobType}</p>
      <p>Status: ${quote.status}</p>
      <p>Estimated price: $${quote.calculateTotal().toFixed(2)}</p>
      <button data-id="${quote.id}" class="complete-button">
        Mark completed
      </button>
    `;

    quoteList.appendChild(card);
  });
}
