const addButtons = document.querySelectorAll('.addButton')
const modals = document.querySelectorAll('.modal')
const saveButtons = document.querySelectorAll('.savebutton')
const input = document.querySelectorAll('input')
let itemList = document.querySelectorAll('ul')
let items;
let text = document.querySelectorAll('.item');


const backlogList = document.getElementById('backlogList')
const progressList = document.getElementById('progressList')
const completeList = document.getElementById('completeList')
const onholdList = document.getElementById('onholdList')
const arrayNames = ['backlogList', 'progressList', 'completeList', 'onholdList']


let dragedItem;
let currentColumn;

//initialize arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onholdListArray = [];
let masterArray = [];

// event listeners

// all the addbuttons
for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener('click', function() {
        addModal(i);
    });
}

// all the savebuttons
for (let i = 0; i < saveButtons.length; i++) {
    saveButtons[i].addEventListener('click', function() {
        const modal = this.closest('.modal');
        const index = Array.from(modals).indexOf(modal);
        toggleModal(index);
    });
}

// saveButton to add item to the list and save them in local storage
for (let i = 0; i < saveButtons.length; i++) {
    saveButtons[i].addEventListener('click', function() {
        addItem(i);
        populateArray()
        saveToLocalStorage()
    });
}

//function that set content addible to true
function toggeleAddible(e) {
    e.target.setAttribute('contenteditable', 'true');
}

function addModal(index) {
    modals[index].classList.add('active');
}

// toggle modal
function toggleModal(index) {
    modals[index].classList.toggle('active');
}

// creates item and updates the DOM

function addItem(index) {
    const newItem = document.createElement('li')
    newItem.classList.add('item');
    newItem.draggable = true;
    newItem.setAttribute('ondragstart', 'drag(event)');
    newItem.setAttribute('ondrop', 'drop(event)')
    newItem.setAttribute('ondragover', 'allowDrop(event)')
    newItem.setAttribute('contenteditable', 'true')
    newItem.innerText = input[index].value;
    itemList[index].append(newItem);
    items = document.querySelectorAll('li');
    input[index].value = "";
    deleteItem();
    
}

function populateArray() {
    
    backlogListArray = Array.from(backlogList.children).map(i => i.innerText);
    progressListArray = Array.from(progressList.children).map(i => i.innerText);
    completeListArray = Array.from(completeList.children).map(i => i.innerText);
    onholdListArray = Array.from(onholdList.children).map(i => i.innerText);
    
    masterArray = [backlogListArray, progressListArray, completeListArray, onholdListArray];
}



populateArray()

//store masterArray to local storage
function saveToLocalStorage() {
    localStorage.setItem('Items', JSON.stringify(masterArray));
}

//loads data from local storage and prepares it to be used with the addItem function
function fetchFromLocalStorage() {
    masterArray = JSON.parse(localStorage.getItem('Items'));
}
fetchFromLocalStorage()

// function that creates items using data from the masterArray
function createItem() {
    if (masterArray) {
        for (let j = 0; j < arrayNames.length; j++) {
            for (let i = 0; i < masterArray[j].length; i++) {
                const newItem = document.createElement('li');
                newItem.classList.add('item');
                newItem.draggable = true;
                newItem.setAttribute('ondragstart', 'drag(event)');
                newItem.setAttribute('ondrop', 'drop(event)')
                newItem.setAttribute('ondragover', 'allowDrop(event)')
                newItem.setAttribute('contenteditable', 'true')
                newItem.textContent = masterArray[j][i];
                document.getElementById(`${arrayNames[j]}`).append(newItem);
                deleteItem();
            };}} }

createItem();

// when item starts draggin
function drag(e) {
    dragedItem = e.target;

}

//when item enters column are
function dragEnter(column) {
    itemList[column].classList.add('over')
    currentColumn = column;
}

// make item droppable into cobox
function allowDrop(e) {
    e.preventDefault();

}

//dropping item
function drop(e) {
    e.preventDefault();
    itemList.forEach((column) => {
        column.classList.remove('over');
    });
    const parent = itemList[currentColumn];
    parent.appendChild(dragedItem);
    populateArray()
    saveToLocalStorage()
    

}

//removes/updates item
function deleteItem() {
    fetchItems = document.querySelectorAll('li');
    fetchItems.forEach((li) => {
        li.addEventListener('focusout', function() {
            if (this.textContent == "") {
                this.remove()
                populateArray();
                saveToLocalStorage();
            } else {
                populateArray()
                saveToLocalStorage()
            }
          })})
}