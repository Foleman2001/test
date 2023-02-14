"use strict"
// Получим данные, и распарсим в объекты
var flagR = 0
var flagD = 0
var flag
var NoSortUserData = null
var UserData = []
var request = new XMLHttpRequest();
request.open('GET', "https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users", true);
request.onloadend = function() {
    parse(request.responseText);
}
request.send();



function parse(obj) {
    UserData = JSON.parse(obj);
    NoSortUserData = JSON.parse(obj);
    InTable(UserData);

}
//сортировка по рейтингу
function SortRanking(obj) {
    Clear.style.display = "flex";

    if (flagR == 1) {
        obj.sort((a, b) => (b.rating - a.rating));
        flagR = 0;
    } else {
        obj.sort((a, b) => (a.rating - b.rating));
        flagR = 1
    }
    InTable(obj)

}
//сортировка по времен
function SortData(obj) {
    Clear.style.display = "flex";

    if (flagD == 1) {
        obj.sort((a, b) => (Date.parse(b.registration_date) - Date.parse(a.registration_date)));
        flagD = 0
    } else {
        obj.sort((a, b) => (Date.parse(a.registration_date) - Date.parse(b.registration_date)));
        flagD = 1
    }
    InTable(obj)
}

function clearFilter() {
    flagR = 0
    flagD = 0
    tbody.remove();
    inputSearch.value = ''
    Clear.style.display = "none";
    InTable(NoSortUserData);
}


function DelUser(objid) {
    console.log(objid)
    flag = objid;
    document.body.style.overflow = 'hidden';
    modalid.style.visibility = ' visible';
}

function Delchoice(obj, answer) {
    if (answer == 'Yes') {
        //удаляем
        for (var i = 0; i <= Object.keys(obj).length; i++) {

            if (obj[i].id == flag) {
                obj.splice(i, 1);
                break;
            }
        }
        //удаляем из запасного списка
        for (var i = 0; i <= Object.keys(NoSortUserData).length; i++) {
            if (NoSortUserData[i].id == flag) {
                NoSortUserData.splice(i, 1);
                break;
            }
        }
        document.body.style.overflow = 'visible';
        modalid.style.visibility = ' hidden';
        InTable(obj);

    }

    if (answer == 'No') {
        document.body.style.overflow = 'visible';
        modalid.style.visibility = ' hidden';

    }

}

function Search(obj) {
    Clear.style.display = "flex";
    var newobj = [];
    for (var i = 0; i < Object.keys(obj).length; i++) {
        if (obj[i].username.toLowerCase().indexOf(inputSearch.value.toLowerCase()) != -1) {
            newobj.push(obj[i])
            console.log(newobj);

        }
        //тк в тз не сказано, что мы ищем по @, ищу по простому.
        if (obj[i].email.toLowerCase().indexOf(inputSearch.value.toLowerCase()) != -1) {
            newobj.push(obj[i])
            console.log(newobj);

        }
    }
    return newobj
}

// //создает строки
function InTable(obj, pag = 5) {
    //////ищем по имени или E-mail
    /////////////////////////////////////////////////////////////////////////////////////////////////

    if (inputSearch.value != '') {
        obj = Search(obj)
    }
    ////////удаляем все что-бы отобразить новую инфу
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    if (document.getElementById("tbody") !== null) {
        document.getElementById("tbody").parentNode.removeChild(document.getElementById("tbody"));
    }

    for (var i = 0; i < Math.ceil((Object.keys(UserData).length) / 5); i++) {
        if (document.getElementById("Pagination") !== null) {
            console.log(document.getElementById("Pagination"));
            document.getElementById("Pagination").parentNode.removeChild(document.querySelectorAll('[id="Pagination"]')[0]);
        } else {
            break;
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    //добавляем управление паггинацией
    for (var i = 1; i <= Math.ceil((Object.keys(obj).length) / 5); i++) {
        Sort.insertAdjacentHTML('beforeend', '<button id="Pagination" onclick="InTable(UserData,' + i * 5 + ')">' + i + '</button>')
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //отрисовываем нужную страницу
    thead.insertAdjacentHTML('afterend', '<tbody id="tbody"></tbody>');
    for (var i = pag - 5; i < Object.keys(obj).length && i < pag; i++) {
        tbody.insertAdjacentHTML('beforeend', '<tr id="del"><td>' + obj[i].username + '</td><td>' + obj[i].email +
            '</td><td>' + obj[i].registration_date.substr(8, 2) + '.' + obj[i].registration_date.substr(5, 2) + '.' +
            obj[i].registration_date.substr(0, 4) + '</td><td>' + obj[i].rating + '</td><td><img id="' + i +
            '" src="icons/Krestiksvgpng.ru_.svg" onclick="DelUser(' + obj[i].id + ')"  alt=""></td></tr>');
    }

    console.log(UserData)

}