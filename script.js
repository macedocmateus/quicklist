const inputItem = document.getElementById('input-item')
const btnAddItem = document.getElementById('btn-add-item')
const itemsList = document.getElementById('items-list')
const deleteFeedback = document.getElementById('delete-feedback')
const closeFeedback = document.getElementById('close-feedback')

const STORAGE_KEY = 'quicklist-items'

let items = []
let feedbackTimeout = null

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function loadFromLocalStorage() {
    const savedItems = localStorage.getItem(STORAGE_KEY)

    if (savedItems) {
        items = JSON.parse(savedItems)
        renderList()
    }
}

function createItem() {
    const newItem = inputItem.value.trim()

    if (newItem === '') {
        return alert('Preencha o campo')
    }

    items = [...items, { text: newItem, completed: false }]

    renderList()
    saveToLocalStorage()

    inputItem.value = ''
    inputItem.focus()
}

function renderList() {
    itemsList.innerHTML = items.map((item, index) => {
        return `<div class="task-item">
                        <label>
                            <input type="checkbox" data-index="${index}" ${item.completed ? 'checked' : ''}>
                            ${item.text}
                        </label>
                        <svg class="delete-icon" data-index="${index}" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.25 4.58325L15.7336 12.9375C15.6016 15.0719 15.5357 16.1392 15.0007 16.9065C14.7361 17.2858 14.3956 17.606 14.0006 17.8466C13.2017 18.3333 12.1325 18.3333 9.99392 18.3333C7.8526 18.3333 6.78192 18.3333 5.98254 17.8457C5.58733 17.6047 5.24667 17.2839 4.98223 16.9039C4.4474 16.1354 4.38287 15.0667 4.25384 12.9293L3.75 4.58325"
                                stroke="#080B12" stroke-width="1.25" stroke-linecap="round" />
                            <path
                                d="M2.5 4.58342H17.5M13.3797 4.58342L12.8109 3.40986C12.433 2.6303 12.244 2.24051 11.9181 1.99742C11.8458 1.9435 11.7693 1.89553 11.6892 1.854C11.3283 1.66675 10.8951 1.66675 10.0287 1.66675C9.14067 1.66675 8.69667 1.66675 8.32973 1.86185C8.24842 1.90509 8.17082 1.955 8.09774 2.01106C7.76803 2.264 7.58386 2.66804 7.21551 3.47613L6.71077 4.58342"
                                stroke="#080B12" stroke-width="1.25" stroke-linecap="round" />
                            <path d="M7.91687 13.75V8.75" stroke="#080B12" stroke-width="1.25" stroke-linecap="round" />
                            <path d="M12.0831 13.75V8.75" stroke="#080B12" stroke-width="1.25" stroke-linecap="round" />
                        </svg>
                    </div>`
    }).join('')
}

function deleteItem(index) {
    items = items.filter((_, item) => item !== index)
    renderList()
    saveToLocalStorage()
    showDeleteFeedback()
}

function showDeleteFeedback() {
    if (feedbackTimeout) {
        clearTimeout(feedbackTimeout)
    }

    deleteFeedback.classList.remove('hidden')

    setTimeout(() => {
        deleteFeedback.classList.add('show')
    }, 10)

    feedbackTimeout = setTimeout(() => {
        hideDeleteFeedback()
    }, 2000)
}

function hideDeleteFeedback() {
    deleteFeedback.classList.remove('show')

    setTimeout(() => {
        deleteFeedback.classList.add('hidden')
    }, 400)
}

function toggleItemComplete(index) {
    items[index].completed = !items[index].completed
    renderList()
    saveToLocalStorage()
}

btnAddItem.addEventListener('click', createItem)

inputItem.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        createItem()
    }
})

itemsList.addEventListener('click', (event) => {
    const deleteIcon = event.target.closest('.delete-icon')
    const checkbox = event.target.closest('input[type="checkbox"]')

    if (deleteIcon) {
        const index = Number(deleteIcon.dataset.index)
        deleteItem(index)
    } else if (checkbox) {
        const index = Number(checkbox.dataset.index)
        toggleItemComplete(index)
    }
})

closeFeedback.addEventListener('click', () => {
    hideDeleteFeedback()

    if (feedbackTimeout) {
        clearTimeout(feedbackTimeout)
    }
})

loadFromLocalStorage()
