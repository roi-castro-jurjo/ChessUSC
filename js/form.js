$('.submit-button').on('click', function() {
    let username = $('#username').val()
    let pswd = $('#password').val()
    let usernameRegEX = /^[a-zA-Z0-9_]{5,20}$/g
    if (usernameRegEX.test(username) == false) {
        alert("Invalid username")
        return
    } 
    if (pswd.length < 8 || pswd.length > 50) {
        alert("Invalid password")
        return
    }
    let form = document.querySelector('form');
    let data = formRecolector(form.elements);
    const dataContainer = document.getElementsByClassName('form-prueba');
    dataContainer.textContent = JSON.stringify(data, null, '  ');

});

//funcion que recoge la informacion de los elementos del Form
const formRecolector = (elements) =>
    [].reduce.call(
    elements,
    (data, element) => {
      data[element.name] = element.value;
      return data;
    },
    {}
);

