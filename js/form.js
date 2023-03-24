$('.submit-button').on('click', function() {
    let username = $('#username').val()
    let pswd = $('#password').val()
    let usernameRegEX = /^[a-zA-Z0-9_]{5,20}$/g
    if (usernameRegEX.test(username) == false) {
        alert("Invalid username");
    } 
    if (pswd.length < 8 || pswd.length > 50) {
        alert("Invalid password");
    }
});


const formToJSON = (elements) =>
  [].reduce.call(
    elements,
    (data, element) => {
      data[element.name] = element.value;
      return data;
    },
    {}
  );



const handleFormSubmit = (event) => {
  // Stop the form from submitting since we’re handling that with AJAX.
  event.preventDefault();

  // TODO: Call our function to get the form data.
  const data = formToJSON(form.elements);

  // Demo only: print the form data onscreen as a formatted JSON object.
  const dataContainer = document.getElementsByClassName('form-prueba');

  // Use `JSON.stringify()` to make the output valid, human-readable JSON.
  dataContainer.textContent = JSON.stringify(data, null, '  ');

  console.log(dataContainer.textContent)

  // ...this is where we’d actually do something with the form data...
};
const form = document.querySelector('form');
form.addEventListener('submit', handleFormSubmit);