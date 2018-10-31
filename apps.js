// Storage Controller
const StorageCtrl = (function(){
  // public methods
  return {
    storeItem: function(item){
      let items;
      // check if any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];
        // push new item
        items.push(item);
        // set LS
        localStorage.setItem('items',JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        // push new item
        items.push(item);
        // re set LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if (localStorage.getItem('items')  === null ) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index){
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index){
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();



// Item Controller
const ItemCtrl= (function(){
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  // Data Structure / State
  const data = {
  /*   items:[
      // {id : 0, name: 'Steak Dinner', calories: 1200},
      // {id : 1, name: 'Cookies', calories: 300},
      // {id : 2, name: 'Eggs', calories: 200}
    ], */
    items : StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0 
  }

  return {
    getItems: function () {
      return data.items
    },
    addItem: function(name, calories){
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length -1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories);
      // create new item
      newItem = new Item(ID, name, calories);
      // Add to items array
      data.items.push(newItem);
      return newItem;
    },
    getItemByID: function(id){
      let found = null;
      // Loop through items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories){
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function(item){
        if (item.id === data.currentItem.id) {
        item.name = name;
        item.calories = calories;
        found = item;          
        }
      });
      return found;
    },
    deleteItem: function(id){
      // Get ids
      const ids = data.items.map(function(item){
        return item.id;
      });
      // Get Index
      const index = ids.indexOf(id);
      // Remove Item
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items= [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
     let total = 0;
       data.items.forEach(function (item) {
         total += item.calories;
         })
      data.totalCalories = total;
      return data.totalCalories;
    },
    logData: function () {
      return data;
    }
  }

})();


// UI Controller

const UICtrl= (function(){
  const UISelectors = {
    itemList:   '#item-list',
    listItems:  '#item-list li',
    addBtn:     '.add-btn',
    updateBtn:  '.update-btn',
    deleteBtn:  '.delete-btn',
    backBtn:    '.back-btn',
    clearBtn:   '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
    // Public Methods
    return {
      populateItemList: function(items){
        let html = '';
        items.forEach(function (item) {
          html += `
          <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt"></i></a>
          </li>`;
        });
        // Insert List Items
        document.querySelector(UISelectors.itemList).innerHTML = html;
      },
      getItemInput: function(){
        return{
          name:document.querySelector(UISelectors.itemNameInput).value,
          calories:document.querySelector(UISelectors.itemCaloriesInput).value
        }
      },
      addListItem: function(item){
        // Show the list
        document.querySelector(UISelectors.itemList).style.display = 'block';
        // Create li element 
        const li = document.createElement('li');
        // Add Class
        li.className = 'collection-item';
        // Add ID
        li.id = `item-${item.id}`;
        // Add HTML
        li.innerHTML =  `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt"></i></a>`;
        // insert Item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
      },
      updatedListItem: function(item){
        let listItems = document.querySelectorAll(UISelectors.listItems);
        // turn node list into array
        listItems = Array.from(listItems);
        listItems.forEach(function (listItem) {
          const itemID = listItem.getAttribute('id');
          if (itemID === `item-${item.id}`) {
            document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt"></i></a>`;
          }
          });

      },
      deleteListItem: function(id){
        const itemID = `#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();
      },
      clearInput: function(){
        document.querySelector(UISelectors.itemNameInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';
      },
      addItemToForm: function(){
        document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState();
      },
      removeItems: function(){
        let listItems = document.querySelectorAll(UISelectors.listItems);
        // turn nodelist into array
        listItems = Array.from(listItems);
        listItems.forEach(function(item){
          item.remove();
        })
      },
      hideList: function(){
       document.querySelector(UISelectors.itemList).style.display = 'none';
      },
      showTotalCalories: function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
      },
      clearEditState: function(){
        UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';
      },
      showEditState: function(){
        UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
      },
      getSelectors: function (){
        return UISelectors;
      }
    }
})();



// App Controller
const App= (function(ItemCtrl, StorageCtrl, UICtrl){
  // load Event Listeners
  const loadEventListeners = function(){
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress',function(e){
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    // Sumbit Edit
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    // Delete Item submit 
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    // Back button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
    // Clear button Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }
  // Add Item Submit
  const itemAddSubmit = function (e) {
    // Get form input from Ui controller
    const input = UICtrl.getItemInput();
    // check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);
      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add Total Calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear Fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }
  // Update Item Submit
  const itemEditClick = function (e) {
   if (e.target.classList.contains('edit-item')) {
    // get list item id (item-0, item-1)
    const listId = e.target.parentNode.parentNode.id;
    // break into an array
    const listIdArr = listId.split('-');
    const id = parseInt(listIdArr[1]);
    const itemToEdit = ItemCtrl.getItemByID(id);
    ItemCtrl.setCurrentItem(itemToEdit);
    UICtrl.addItemToForm();
   }
    e.preventDefault();
  }
  const itemUpdateSubmit = function (e) {
    // Get Item input
    const input = UICtrl.getItemInput();
    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    // Update UI
    UICtrl.updatedListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update Local Storage
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();
    
     e.preventDefault();
  }
  const itemDeleteSubmit = function (e) {
    // Get Item input
    const currentItem = ItemCtrl.getCurrentItem();

    ItemCtrl.deleteItem(currentItem.id);
    // delete from ui
    UICtrl.deleteListItem(currentItem.id);

     // get total calories
     const totalCalories = ItemCtrl.getTotalCalories();
     // Add Total Calories to UI
     UICtrl.showTotalCalories(totalCalories);
 
    //  delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

     UICtrl.clearEditState();
    
     e.preventDefault();
  }
  // Clear Items Event
  const clearAllItemsClick = function (e) {
    // Delete All items from data stucture
    ItemCtrl.clearAllItems();
   
    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add Total Calories to UI
    UICtrl.showTotalCalories(totalCalories);

     // remove form UI
     UICtrl.removeItems();
    //  clear from LS
     StorageCtrl.clearItemsFromStorage();
    //  Hide UL
    UICtrl.hideList();

     e.preventDefault();
  }

  // Public Methods
  return {
    init: function () {
      // Set Inital State
      UICtrl.clearEditState();
    //  Fetch Items Form Data Sturcture
      const items = ItemCtrl.getItems();
      // check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
      // populate list with items 
      UICtrl.populateItemList(items);
      }
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      // Load Event Listeners
      loadEventListeners();
    }
  }
})(ItemCtrl,StorageCtrl, UICtrl);

// Intialize App
App.init();
