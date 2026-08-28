// Run configuration as soon as the DOM finishes rendering
document.addEventListener('DOMContentLoaded', () => {
    loadFeedback();
    document.getElementById('feedbackForm').addEventListener('submit', handleFeedbackSubmit);
    
    // Optional: Hook up a search bar to test the Filter/Map features
    const searchBar = document.getElementById('feedbackSearch');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => filterAndDisplayFeedback(e.target.value));
    }
});

// 1. Handle form submissions (Concept 1: Create/Read with length tracking)
function handleFeedbackSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('userName');
    const commentInput = document.getElementById('userComment');

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (!name || !comment) return; // Guard against empty form submissions

    const newFeedback = {
        id: Date.now(), 
        name: name,
        comment: comment
    };

    saveFeedbackToStorage(newFeedback);
    
    // Reload the full list to reflect the new total and update UI state
    loadFeedback();

    // Reset input states
    nameInput.value = '';
    commentInput.value = '';
}

// 2. Save payload into local state array (Concept 1: Array push)
function saveFeedbackToStorage(item) {
    const existingFeedback = JSON.parse(localStorage.getItem('userFeedback')) || [];
    
    // Concept 1: Add new entry to the end of the collection using push
    existingFeedback.push(item);
    
    localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));
}

// 3. Extract and display saved items (Concept 3: Guard empty arrays)
function loadFeedback() {
    const savedFeedback = JSON.parse(localStorage.getItem('userFeedback')) || [];
    const feedbackList = document.getElementById('feedbackList');

    // Concept 3: Guard empty arrays. Handle the empty state cleanly.
    if (!savedFeedback.length) {
        feedbackList.innerHTML = `<div class="no-feedback">No feedback items yet. Be the first to leave one!</div>`;
        updateCounter(0);
        return;
    }

    // Concept 1: Read array length to update a counter badge on your site
    updateCounter(savedFeedback.length);

    // Render the complete list
    renderList(savedFeedback);
}

// 4. Advanced Feature: Search (Concept 2: Filter and Map)
function filterAndDisplayFeedback(query) {
    const savedFeedback = JSON.parse(localStorage.getItem('userFeedback')) || [];
    
    // Concept 2: Filter items based on user search term match
    const filteredFeedback = savedFeedback.filter(item => 
        item.comment.toLowerCase().includes(query.toLowerCase()) || 
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    // Concept 3: Guard the filtered results array if no matches are found
    if (!filteredFeedback.length) {
        document.getElementById('feedbackList').innerHTML = `<div class="no-feedback">No results match "${escapeHTML(query)}"</div>`;
        return;
    }

    renderList(filteredFeedback);
}

// Helper: Master render function using Concept 2 (Map)
function renderList(arrayToRender) {
    const feedbackList = document.getElementById('feedbackList');
    
    // Concept 2: Map the objects into an array of clean HTML structural strings, then join them
    const htmlCards = arrayToRender.map(item => `
        <div class="feedback-item">
            <strong>${escapeHTML(item.name)}</strong>
            <p>${escapeHTML(item.comment)}</p>
        </div>
    `).join(''); // Joins the array into one continuous string

    feedbackList.innerHTML = htmlCards;
}

// Helper: Update a text node tracking the total feedback count
function updateCounter(count) {
    const counterEl = document.getElementById('feedbackCounter');
    if (counterEl) {
        counterEl.textContent = `Total Reviews: ${count}`;
    }
}

// Helper: Mitigate script injection hazards
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
