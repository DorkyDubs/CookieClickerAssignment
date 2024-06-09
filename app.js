console.log("Hi there");
let pausePlease = false;
//need gobal vriable for cookie count
let cookieCount = 0;
let cookiesPerSecond = 0;
let gameStarted = JSON.parse(localStorage.getItem("running"));
let gameInterval;
let itemsOwnedInterval;
let shopItems;
const mainCookie = document.querySelector(".main-cookie");
mainCookie.style.display = "none"; // this is hidden until initial api load, because on the very small chance it's listener is triggered before then it will break the data retrieval system. reinstated end of storebuild()

mainCookie.addEventListener("click", () => {
  cookieCount++;
  cookieCountDisplay.textContent = `${cookieCount}`;
  cookieCountDisplay.ariaLabel = `You currently have ${cookieCount} cookies`;

  if (gameStarted !== true) {
    //this initialises the interbals and storage after the first click on the big cookie
    //change to !== true if there are issues
    gameStarted = true;
    gameInterval = setInterval(() => {
      cookieCount = cookieCount + cookiesPerSecond;
      cookieCountDisplay.textContent = `${cookieCount}`;
      dataUpdate();
    }, 1000);
    dataUpdate();
  }
});

const displaySection = document.getElementById("display");
const collectionData = document.createElement("div"); //box for display data
collectionData.className = "score-display";
// let scoreDisplay = document.querySelector(".score-display");
const cookieCountDisplay = document.createElement("h1");
const cookiesPerSecondDisplay = document.createElement("h2");

cookieCountDisplay.textContent = `${cookieCount}`;
cookieCountDisplay.ariaLabel = `You current have ${cookieCount} cookies`;
cookieCountDisplay.tabIndex = "2";

function buildDisplay() {
  // made into a function to initialise during shop build to ensure all up to date data is prsent when running

  cookiesPerSecondDisplay.textContent = `CPS:${cookiesPerSecond}`;
  cookiesPerSecondDisplay.ariaLabel = `You are currently collecting ${cookiesPerSecond} cookies per second`;
  cookiesPerSecondDisplay.tabIndex = "3";
  displaySection.appendChild(collectionData);
  // scoreDisplay.style.display = "flex";
  // scoreDisplay.style.flexDirection = "column";
  collectionData.appendChild(cookieCountDisplay);
  cookiesPerSecondDisplay.style.height = "46px"; //this fixes display size when changing content font size, looks okay on different screen sizes but possibly another way to make sure this happens in a dynamic way
  collectionData.appendChild(cookiesPerSecondDisplay);
}

let fetchedItems; //local or fetched API data goes here

async function restockShopItems() {
  let localCheck = localStorage.getItem("count");

  if (localCheck !== null) {
    cookieCount = JSON.parse(localStorage.getItem("count"));
    cookiesPerSecond = JSON.parse(localStorage.getItem("CPS"));
    fetchedItems = JSON.parse(localStorage.getItem("shop"));
  } else {
    //get api, display in store
    //fetch api (this arrives in the form of an array of objects) REMEMBER TO ASYNC AND AWAIT
    const response = await fetch(
      "https://cookie-upgrade-api.vercel.app/api/upgrades"
    );

    //turn the data into jason --->.json()//Thisis now an array //push elemtns in shopitem array
    fetchedItems = await response.json(); // this is how we get in into the Array

    fetchedItems.forEach((item) => {
      item.owned = 0;
    });
  } /// this will be fetchinf data from local stroage.
  return await fetchedItems;
}
shopItems = await restockShopItems();
const shopItemsBasePack = JSON.stringify(shopItems); // this is to prevent variable refrence issues later in the reset

let storeDisplay = document.querySelector(".shop");

function createShopButton(thisItem, Container, index) {
  //function to govern button creation with eventlisteners, objects data, and other logic depending on which object drawn from API

  const buyButton = document.createElement("button");
  buyButton.tabIndex = `${4 + index}`; //

  buyButton.className = "purchase-button";
  buyButton.textContent = `${thisItem.cost}`;

  buyButton.addEventListener("click", (ourItem) => {
    if (thisItem.cost <= cookieCount && thisItem.owned < 10) {
      //check to see if able to buy
      thisItem.owned += 1;

      if (thisItem.owned === 10) {
        // logic controlling buy button text depending on amount bought
        buyButton.textContent = "MAX";
        buyButton.ariaLabel = `${thisItem.name} maximum amount owned. Earning ${
          thisItem.increase * 10
        } cookies a second`;
        buyButton.style.color = "green";
      } else {
        buyButton.textContent = `${thisItem.cost}`;
        buyButton.style.color = "red";
        buyButton.ariaLabel = `${thisItem.name}. ${
          thisItem.owned
        } currently owned, earning you ${
          thisItem.increase * thisItem.owned
        } cookies per second. You are able to buy ${
          10 - thisItem.owned
        } more when you have enough cookies`;
      }

      thisItem.textContent = `${thisItem.owned}/10 owned`;

      cookiesPerSecond = cookiesPerSecond + thisItem.increase;

      cookiesPerSecondDisplay.textContent = `CPS:${cookiesPerSecond}`;
      cookiesPerSecondDisplay.ariaLabel = `You are currently collecting ${cookiesPerSecond} cookies per second`;
      cookieCount = cookieCount - thisItem.cost;
      dataUpdate();
    } else if (thisItem.cost > cookieCount) {
      //logic to control what happens if not enough cookie for upgrade

      buyButton.textContent = "Nope";
      buyButton.style.color = "black";
      buyButton.style.fontWeight = "bolder";
      cookiesPerSecondDisplay.textContent = `Not enough cookies, need ${
        thisItem.cost - cookieCount
      } more`;
      cookieCountDisplay.ariaLabel = `You do not have enough cookies, you need ${
        thisItem.cost - cookieCount
      } more`;
      cookieCountDisplay.ariaLive = "assertive";
      cookiesPerSecondDisplay.style.color = "red";
      cookiesPerSecondDisplay.style.fontSize = "20px";
      cookiesPerSecondDisplay.style.fontWeight = "bold";
      cookiesPerSecondDisplay.style.height = "46px";
      setTimeout(() => {
        buyButton.textContent = `${thisItem.cost}`;
        buyButton.style.color = "red";
        buyButton.style.fontWeight = "normal";
        cookiesPerSecondDisplay.textContent = `CPS:${cookiesPerSecond}`;
        cookiesPerSecondDisplay.ariaLabel = `You are currently collecting ${cookiesPerSecond} cookies per second`;
        cookiesPerSecondDisplay.ariaLive = "off";
        cookiesPerSecondDisplay.style.color = "black";
        cookiesPerSecondDisplay.style.fontSize = "40px";
        cookiesPerSecondDisplay.style.fontWeight = "normal";
      }, 1000);
    }
  });
  buyButton.ariaLabel = `${thisItem.name}. Adds ${thisItem.increase} cookies per second. It costs ${thisItem.cost} and you currently have ${cookieCount} cookies to spend`;
  Container.appendChild(buyButton);
}

function buildStore(itemCrate) {
  buildDisplay();
  itemCrate.forEach((item, index) => {
    let itemDisplayContainer = document.createElement("div"); //this is to hold data for an item in a row in a shop
    itemDisplayContainer.className = "upgrade-info-container"; //this is so we can style the element
    let nameDisplay = document.createElement("h3");

    nameDisplay.textContent = `${item.name}`;
    itemDisplayContainer.appendChild(nameDisplay);

    let numberOwnedDisplay = document.createElement("h3");
    numberOwnedDisplay.textContent = `${item.owned}/10 owned`;
    itemsOwnedInterval = setInterval(function () {
      numberOwnedDisplay.textContent = `${item.owned}/10 owned`; // this updates ownership no# on page
    }, 1); // trying to implemented either here by initialising button and event listener or in  createbutton function would not work, maybe due to variable scope, maybe not

    itemDisplayContainer.appendChild(numberOwnedDisplay);
    let expectedIncrease = document.createElement("h3");
    expectedIncrease.textContent = `+${item.increase} per second`;
    itemDisplayContainer.appendChild(expectedIncrease);

    // needs to be a button for specific item displaying price, with click event attached
    createShopButton(item, itemDisplayContainer, index); //maybe work to stnardise buttno size (in Css)

    storeDisplay.appendChild(itemDisplayContainer);
  });
  mainCookie.style.display = "block";
  mainCookie.tabIndex = "1"; //risking a bug on bad browsers like internet explorer that would start on tabIndex 1 then move to zero

  let resetButtonContainer = document.createElement("div"); //this logic governs the reset
  resetButtonContainer.className = "reset-holder";
  let resetButton = document.createElement("button");
  resetButton.tabIndex = "14";
  resetButton.className = "reset-button";
  resetButton.textContent = "Reset Progress?";
  resetButton.ariaLabel = "Use this to reset Progress";
  resetButton.addEventListener("click", () => {
    resetButton.style.display = "none";
    resetButtonContainer.textContent = "Are you sure?";
    resetButtonContainer.ariaLabel = "Are you sure you want to reset?";

    const resetYesButton = document.createElement("button");
    resetYesButton.tabIndex = "16"; //makes sense when considering page layout but not code layout
    resetYesButton.marginLeft = "0.5rem";
    resetYesButton.className = "reset-button";
    resetYesButton.textContent = "Yes, do it!";
    resetYesButton.ariaLabel =
      "Select if you're certain you wish to reset all progress, including upgrades and cookies collected";
    resetYesButton.addEventListener("click", () => {
      resetButtonContainer.ariaLabel = "";
      resetGame();
    });
    const resetNoButton = document.createElement("button");
    resetNoButton.tabIndex = "15";
    resetNoButton.className = "reset-button";
    resetNoButton.style.marginLeft = "10px";

    resetNoButton.textContent = "Actually, no";
    resetNoButton.ariaLabel =
      "Use this if you'd prefer to go back and continue with the current game";
    resetNoButton.addEventListener("click", () => {
      resetButtonContainer.textContent = "";
      resetButton.style.display = "block";
      resetYesButton.remove();
      resetNoButton.remove();
      resetButtonContainer.ariaLabel = "";
      resetButtonContainer.appendChild(resetButton);
    });

    resetButtonContainer.appendChild(resetNoButton);
    resetButtonContainer.appendChild(resetYesButton);
  });
  resetButtonContainer.appendChild(resetButton);
  storeDisplay.appendChild(resetButtonContainer);
}
function dataUpdate() {
  //preparing save state
  // // cookieCountDisplay.textContent = `${cookieCount}`;
  // if (pausePlease === false) { // used for debugging
  //   ///REMOVE WHEN RESET IS SETUP
  if (gameStarted === true) {
    let stringifiedCookieCount = JSON.stringify(cookieCount);
    localStorage.setItem("count", stringifiedCookieCount);
    let stringifiedCPS = JSON.stringify(cookiesPerSecond);
    localStorage.setItem("CPS", stringifiedCPS);
    let stringifiedStore = JSON.stringify(shopItems);
    localStorage.setItem("shop", stringifiedStore);
    let stringifiedGameStart = JSON.stringify(gameStarted);
    localStorage.setItem("running", stringifiedGameStart);
  }
}

buildStore(shopItems);

if (gameStarted === true) {
  /// this logic makes the game continue running after refresh without clicking first cookie

  cookieCountDisplay.textContent = `${cookieCount}`;
  gameInterval = setInterval(() => {
    cookieCount = cookieCount + cookiesPerSecond;
    cookieCountDisplay.textContent = `${cookieCount}`;
    cookiesPerSecondDisplay.ariaLabel = `You are currently collecting ${cookiesPerSecond} cookies per second`;
    cookieCountDisplay.ariaLabel = `You currently have ${cookieCount} cookies`;
    dataUpdate();
  }, 1000);
}

function resetGame() {
  // pausePlease = true; //bebugging tool

  cookieCount = 0;
  cookieCountDisplay.textContent = `${cookieCount}`;
  cookiesPerSecond = 0;
  cookiesPerSecondDisplay.textContent = `CPS:${cookiesPerSecond}`;
  gameStarted = false;

  shopItems = JSON.parse(shopItemsBasePack);

  gameStarted = null;
  localStorage.clear();
  clearInterval(gameInterval);
  clearInterval(itemsOwnedInterval);
  storeDisplay.innerHTML = null;

  buildStore(shopItems);
}
