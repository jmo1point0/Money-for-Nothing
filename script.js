var query
var stockList
var compInfo

var closeingPrice
var yearHigh
var yearLow
var isoDatefix

// Info for Company Card
var sector
var exchange
var qEarningsGrowthYOY
var qRevenueGrowthYOY
var qRevenue
var compName
var LSWL

//NEWS API
var news
var abstract
var url
var title
var hotTitle


//Infor for Local Storage and Watch List


function LS(){
  if (LSWL === null ){
    LSWL = []
  }
}

var LSWL = JSON.parse(localStorage.getItem('LSWL'))
var newWLItemcheck


// Saves the last thing searched in a variable
function searchButton(event) {
  event.preventDefault()
  var tempQuery = `${document.querySelector('#input').value}`
  // Query is stored in upper-case. Lower-case was affecting some results
  query = tempQuery.toUpperCase()
  console.log(`You searched for "${tempQuery}"`)

  // Passes query to  companySearch()
  companySearch(query)
  // Passes query to  stockSearch()
  stockSearch(query)
}





// Uses the query to find the searched companies' information
async function companySearch(query) {
  // API query is saved to a variable
  compInfo = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${query}&outputsize=size&apikey=RTGQ9JMEEPU9J881`).then(r => r.json())

  console.log(compInfo)
  // Saves needed information in their own variables
  sector = compInfo.Sector
  exchange = compInfo.Exchange
  qEarningsGrowthYOY = compInfo.QuarterlyEarningsGrowthYOY
  qRevenueGrowthYOY = compInfo.QuarterlyRevenueGrowthYOY
  compName = compInfo.Name
  yearHigh = parseFloat(compInfo["52WeekHigh"]).toFixed(2)
  yearLow = parseFloat(compInfo["52WeekLow"]).toFixed(2)

  // LOGS INFO TO THE CONSOLE
  console.log(`${query}'s info\nTheir sector is: [${sector}]\nTheir exchange is: [${exchange}]\nTheir Quarter Earnings is: [${qEarningsGrowthYOY}]\nTheir Quarterly Revenue Growth is: [${qRevenueGrowthYOY}]`)
  console.log('query')

  // Check Local Storage for company
  checkLS(compName)
}

// Uses query to find they previous day's closing price
async function stockSearch(query) {
  // API query is saved to a variable
  stockList = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${query}&outputsize=size&apikey=RTGQ9JMEEPU9J881`).then(r => r.json())

  console.log(stockList)
  // Closing price is parsed to a float and saved to a variable
  closeingPrice = parseFloat(stockList["Time Series (Daily)"][`${isoDatefix}`]["4. close"])

  console.log(closeingPrice)

  changeCompInfo()
}

// Displays company info in a card on screen
function changeCompInfo() {
  // Dispalys Sector
  document.querySelector('#cardSector').innerHTML = `Sector: <strong>${sector}</strong>`
  // Dispalys Exchange
  document.querySelector('#cardExchange').innerHTML = `<strong>${exchange}</strong>`
  // Dispalys Quarterly Earnings
  document.querySelector('#cardQEarnings').innerHTML = `<strong>${qEarningsGrowthYOY}</strong>`
  // Dispalys Quarterly Revenue
  document.querySelector('#cardQRevenue').innerHTML = `<strong>${qRevenueGrowthYOY}</strong>`
  // Dispalys the latest Closing Price
  document.querySelector('#dateNow').innerHTML = `As of: <strong>${isoDatefix}</strong>`
  // Dispalys the latest Closing Price
  document.querySelector('#sharePrice').innerHTML = `Share Price: <strong>${closeingPrice}</strong>`
  // Dispalys the Company Name
  document.querySelector('#companyName').innerHTML = `${compName}`
  // Dispalys the 52 Week High
  document.querySelector('#yearHigh').innerHTML = `52 Week High: <strong>${yearHigh}</strong>`
  // Dispalys the 52 Week Low
  document.querySelector('#yearLow').innerHTML = `52 Week Low: <strong>${yearLow}</strong>`

  if(`${qEarningsGrowthYOY}`< 0 ) {document.querySelector("#cardQEarnings").style.color = "red"}
  if(`${qRevenueGrowthYOY}`< 0 ) {document.querySelector("#cardQRevenue").style.color = "red"}
}

function getYesterday() {
  var day = new Date()
  var yesteday = day.setDate(day.getDate() - 1)
  var isoDate = day.toISOString()
  isoDatefix = isoDate.slice(0, 10)
  console.log(`The previous day is: ${isoDatefix}`);
}

// get news API
async function getNews() {
  news = await fetch('https://api.nytimes.com/svc/topstories/v2/business.json?api-key=IlIdSVUvpiF5PABbTeerA3kRncTqyqAo').then(r => r.json()) 
  console.log(news)
  for (i = 0; i < 3; i++){
  
  title = news.results[i].title
  console.log(title)
  url = news.results[i].url
  hotTitle = title.link(`${url}`)
  console.log(url)
  changeNewsInfo()

}}

// Displays news info in a card on screen
function changeNewsInfo() {
  // Displays title of News
  document.querySelector(`#newsstory${i}`).innerHTML += `<strong>${hotTitle}</strong>`
}


// Scan local storage
function checkLS(compName){
  // check to see if company is already on watch list     
  console.log(`${compName}`)
  // if result is less than 0 not on the list
  newWLItemcheck = LSWL.indexOf(`${compName}`)
  console.log(newWLItemcheck)
  // change wachlist button color and text
  if (newWLItemcheck >= 0){
    console.log(newWLItemcheck<1)
    console.log(newWLItemcheck)
    console.log(typeof(newWLItemcheck))
    
    document.querySelector('.wlbtn').classList.replace("btn-success", "btn-danger")
    document.querySelector('.wlbtn').innerHTML = "- from Watchlist"
  } else {
    document.querySelector('.wlbtn').classList.replace("btn-danger","btn-success")
    document.querySelector('.wlbtn').innerHTML = "+ to Watchlist"
  }
}



// Watchlist button trigger (add or remove from list)
function watchListBtn(event){
  console.log("Watch List button pressed")
  var wlbtnresults = document.querySelector('.wlbtn').innerText
  if(wlbtnresults === "+ to Watchlist"){
    console.log("good to go")
    addLocalStorage()
  } else {
    console.log("no go")
    removeLocalStorage()
  }  
}

// save items to local storage
function addLocalStorage(){
  console.log("add Local Storage function started")
  // pull Local Storage if exists
  if(localStorage.getItem("LSWL")=== null){
    LSWL = [];
  } else {
    LSWL = JSON.parse(localStorage.getItem('LSWL'));
  }
  // if section is not blank proceed else stop
  if (compName != null ) {
    LSWL.push(compName);
  } else {alert("Search for a company using the search bar")
  }
  // Push updated array with new item back to Local Storage
  localStorage.setItem('LSWL', JSON.stringify(LSWL));
  watchlist()
}

// remove from local storage
function removeLocalStorage(){
 
  console.log("remove Local Storage function started")
  console.log(newWLItemcheck)
  LSWL = JSON.parse(localStorage.getItem('LSWL'));
  LSWLnew = LSWL.splice(newWLItemcheck,1)
  localStorage.setItem('LSWL', JSON.stringify(LSWL));
  console.log(LSWL)
  watchlist()
}


// Add to  Watchlist
function watchlist(){
  document.querySelector('.list-group').innerHTML = ""
  var LSWLLength = LSWL.length
  for (i=0; i < LSWLLength; i++){
    document.querySelector('.list-group').innerHTML += `<li class="wlBtn"><button onclick="wlBtnSearch(event)">${LSWL[i]}</button></li>`
  }
}

//when the watchlist button is pushed, pass the company name via the search function trigger
  function wlBtnSearch(event){
    console.log("WL button click")
    var wlbSearch = document.querySelector(".wlBtn").innerText
    console.log(wlbSearch)
    stockSearch(wlbSearch)
  }

//Infor for Local Storage and Watch List




LS()
watchlist()
getNews()
getYesterday()

