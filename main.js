var books;

readFile("library.json", function(text) {
    books = JSON.parse(text).library;
    allBooksHtml(books);
});

var count = 0;
function allBooksHtml(books) {
    generateHtml('all_books', books);
}


var sortType = '';

function sortBooks(type) {
    sortType = type;
    books.sort(count % 2 === 0 ? sortA : sortZ);
    count++;
    generateHtml('all_books', books);
}

function generateHtml(type, data, search) {
    readFile("templates/"+type+".ejs", function (file) {
        document.getElementById("main_container").innerHTML = ejs.render(file, {data: data, search: search});
    });
}

function sortA(a,b) {
    if (a[sortType] < b[sortType])
        return -1;
    if (a[sortType] > b[sortType])
        return 1;
    return 0;
}

function sortZ(a,b) {
    if (a[sortType] > b[sortType])
        return -1;
    if (a[sortType] < b[sortType])
        return 1;
    return 0;
}

function readFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

function searchBook() {
    var selected = document.getElementById("selectBox").value;
    var searchValue = document.getElementById("search_value").value.toLowerCase();
    var length = searchValue.length;

    if(length > 2){
        console.log(length);
        var bookSearched = books.filter(function (obj) {
            return obj[selected].toLowerCase().search(searchValue) > -1;
        });
    } else {
        return;
    }
    generateHtml('all_books', bookSearched, true);
}

var singleBook;
function singleViewBook(bookId) {
    singleBook = books.find(function (obj) {
        return obj.id === bookId;
    });
    generateHtml('single_book', singleBook);
}

function showBookForm() {
    generateHtml('rent_book_form', {});
}


// FORM VALIDATION //

var clickCount = 0;
var validation = false;
function rentBook(){

    var htmlElements = {
        input: document.getElementsByClassName("input_wrapper"),
        email: document.getElementById("email")
    };
    var errorMsg = {
        empty: "This filed is required !",
        letters: "Must be letters !",
        email: "Invalid Email Address. The format mast be 'example@' !"
    };
    var patterns = {
        letters: /^[a-zA-Z']/,
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    };
    var nameErrors;

    function formValidation(callback) {
        clickCount = 0;
        for(var i = 0; i < htmlElements.input.length; i++){

            var  newElement = document.createElement("div");
            newElement.setAttribute("class", "error" );
            var parentInput = htmlElements.input[i];
            var inputData = htmlElements.input[i].querySelector("input").getAttribute("type");
            nameErrors = htmlElements.input[i].querySelector("input").nextElementSibling;

            if(nameErrors !== null ) {
                nameErrors.remove();
            }
            if (htmlElements.input[i].querySelector("input").value === "") {
                parentInput.appendChild(newElement);
                newElement.innerHTML = errorMsg.empty;
                clickCount++;
            } else {
                if (inputData === "text"){
                    if (patterns.letters.test(htmlElements.input[i].querySelector("input").value)) {
                        clickCount++;
                    } else {
                        parentInput.appendChild(newElement);
                        newElement.innerHTML = errorMsg.letters;
                    }
                }
                if (inputData === "email"){
                    if(patterns.email.test(htmlElements.input[i].querySelector("input").value)){
                        clickCount++;
                    } else {
                        parentInput.appendChild(newElement);
                        newElement.innerHTML = errorMsg.email;
                    }
                }
            }
        }
        callback();
        validation = true;
    }
    console.log(clickCount);
    formValidation(function () {
        if(clickCount === 3 && validation === true ){
            generateHtml('rent_details', singleBook);
            getCurrentDate();
        }
    });
}

function getCurrentDate() {
    var dateRenting = moment(new Date());
    var dateReturn = moment().add(1, 'months').unix();

    console.log("start date" + " " + dateRenting);
    console.log("end date" + " " + dateReturn);
}




