

checkUI();//checks as soon as page loads 


//funtion to implement dynamic. if no of list item>0, filter and clear all are visible. if not, they r hidden
function checkUI()
{
	const filter = document.getElementById('form-filter');
    const clearA = document.getElementById('clear');
    const litems = document.querySelectorAll('li');
    if(litems.length === 0)
    {
    	filter.style.display='none';
    	clearA.style.display='none';
    }
    else
    {
    	filter.style.display='block';
    	clearA.style.display='block';

    }

};//  note this func needs to be called inside every function that has to do with removal or addition of items

function checkDuplicate(p)
{
	let itemsFromStorage = getItems();
	return itemsFromStorage.includes(p);//returns true if p string is present in array itemsFromStorage
}



//add items via button
const form = document.getElementById('formm');//selecting the form
function onSubmit(e,itemf)
{ 
	    e.preventDefault();

        if(isEditMode)
        {
        	//identifying the item to be edited
        	const editItem =  listItems.querySelector('.edit');
        	console.log(editItem);
        	editItem.classList.remove('edit');
        	removeItem(editItem);
        	isEditMode=false;// this ensures that from this point the button works normally, ie takes in item to add
        	btn.classList.remove('green');//once edited item is submitted, button is changed to bg color gray again
        	btn.innerText = '+Add Item';//also inner text is changed back

            //the rest is 'add to DOM' process
          	const newli = document.createElement('li');
		    newli.setAttribute('class','each');
	
		    newli.innerHTML = `${document.getElementById('item-input').value}<button class="x">
     			X
     		</button>`;
	        document.getElementById('list').appendChild(newli);//end of main action
        }
        else
        {
        	if(checkDuplicate(document.getElementById('item-input').value))
	    {
	    	alert('this item already exists');
	    	return;//return is important because this will actually prevent the new item from being listed
	    	//dont forget to add this code snippet to addToLocalStorage function cause otherwise item
	    	//will not get added to DOM but will get added to localStorage
	    }

	    //the rest is 'add to DOM' process
	    const newli = document.createElement('li');
		newli.setAttribute('class','each');
	    newli.innerHTML = `${document.getElementById('item-input').value}<button class="x">
     			X
     		</button>`;
	    document.getElementById('list').appendChild(newli);//end of main action
       
        }
         
         
          checkUI();//checks to add filter and cancel even if one item is added
};

form.addEventListener('submit', onSubmit);


//clear all items by clicking 'all clear' button

const allbtn = document.querySelector('.clear');


allbtn.addEventListener('click', (e)=>{
	const items = document.querySelectorAll('li');
	items.forEach((eachitem)=>{
		eachitem.remove();
		localStorage.clear();
		checkUI();//hides 'filter' and 'clear all' after every item is removed
	})
});


//making the 'filter items' functional

function filterItems(e)
{
	const itemslist = documesnt.querySelectorAll('li');
	const userinput = e.target.value.toLowerCase();//whatever is being input by user in filter field
	
	

	itemslist.forEach((items)=>{
		const thetext = items.firstChild.textContent.toLowerCase();//extracting the txt from each li since that is the firstchild
		if(thetext.indexOf(userinput)!=-1)//comparing filter input with text inside each li.. those li which satisfy
			//condition are displayed
		{
			items.style.display='flex';//display:flex since original setting of li's is flex
		}
		else
		{
			items.style.display='none';
		}
});

};

const filter = document.getElementById('form-filter');//input field of filter
filter.addEventListener('input', filterItems);//end of filter


//adding items to local storage upon form submission ...

function getItems()//function to retrieve values from localStorage. is used universally for all localstorage operations
{
	let itemsFromStorage=[];
	if(localStorage.getItem('items')===null)//this condition is given so that if localstorage has any items 
		//stored in it previously, new item gets added on top of that and so that the previous items
	//dont get lost.
	{
		itemsFromStorage = [];
	}
	else
	{
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}
	return itemsFromStorage;
};

function addToLocalStorage(itom)
{
 
    //in local storage, data is saved only in the form of string. when we take data out from local storage to 
    //operate on it, we convert to array using JSON.parse and after pushing in new item we JSON.stringify 
    //it back to string
	let itemsFromStorage=getItems();

	 if(checkDuplicate(itom))
	    {
	    	alert('this item already exists');
	    	return;//return is important because this will actually prevent the new item from being listed
	    }
	    else{


	itemsFromStorage.push(itom);
	//convert to json string and set to local storage
	localStorage.setItem('items',JSON.stringify(itemsFromStorage));}
};


function addToLocalStoragee(e)
{
	const tom = document.getElementById('item-input').value;
	addToLocalStorage(tom);

};

form.addEventListener('submit', addToLocalStoragee);
//end


//code to make sure when page reloads, the items saved in localStorage are displayed on DOM

function finalfunc(e,itemf)//coverts retrieved items from localstorage to proper li's 
{ 
	    e.preventDefault();
		const newli = document.createElement('li');
		newli.setAttribute('class','each');
	
		newli.innerHTML = `${itemf}<button class="x">
     			X
     		</button>`;
	    document.getElementById('list').appendChild(newli);//end of main action

        checkUI();//checks to add filter and cancel even if one item is added
};

function onload(e)
{
	const obj = getItems();
	obj.forEach((item)=>finalfunc(e,item));
}
document.addEventListener('DOMContentLoaded', onload);// as long as dom content gets loaded on page, the list items
//are retrieved fom localstorage and displayed on page.

//end of this code

//code to make 'x' button functional. on clicking x, item will be removed from DOM as well a localStorage. 
//multiple funtions have been used but its fairly easy


//we will select the ul now to do this removal from local storage job ... and also for purposes to be disclosed in future
const listItems = document.getElementById('list');
function onClickList(e)
{
	if(e.target.parentElement.classList.contains('each'))//'each'is the className for each li
	{
		removeItem(e.target.parentElement);
	};
}
function removeItem(i)
{   //remove item from DOM
	i.remove();
	
	
	//remove item from localStorage
	removeFromLS(i.firstChild.textContent);

	checkUI();
};
function removeFromLS(val)
{
	let itemsFromStorage = getItems();
	itemsFromStorage = itemsFromStorage.filter((k)=>k!==val);//k refers to each string in itemsFromStorage array
//filter generates a new array. this new array will not include 'val'
	
	//now setting the new itemsFromStorage 
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));

};
listItems.addEventListener('click', onClickList);
//end of this code 


// the following code implements activating 'edit mode' on clicking on item.
let isEditMode = false;

function onClickEdit(e)
{
	if(e.target.classList.contains('each'))//ie, if li is clicked
	{
		editModeOn(e.target);
	};

};

function editModeOn(item)//item = li 
{
	    isEditMode = true;
	    listItems.querySelectorAll('li').forEach(i=>i.classList.remove('edit'));
	    //(code above)so that every other li gets back to normal when its out of focus
	    document.getElementById('item-input').value  = item.firstChild.textContent;
        let btn = document.getElementById('btn');// this is the 'add item' button
		btn.classList.add('green');//this makes the button's background color -> forestgreen
		btn.innerText = 'Update Item';
		item.classList.add('edit');// this makes the selected list item font color lighter
};

//the rest of the code is inside onSubmit() function


listItems.addEventListener('click',onClickEdit);
