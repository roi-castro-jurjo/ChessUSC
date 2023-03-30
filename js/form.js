var submitButton = document.getElementsByClassName('submit-button')
$(submitButton).on('click', function() {
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
});

