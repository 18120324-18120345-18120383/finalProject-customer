const password = document.getElementById('password')
const newPassword = document.getElementById('newPassword')
const retype = document.getElementById('retype')
const errPassword = document.getElementById('errPassword')
const errRetypePassword = document.getElementById('errRetypePassword')

const validateForm = () => {
    if (retype.value !== newPassword.value){
        return false;
    }
    return true;
}

password.onchange = () => {
    $.getJSON('/api/authenticate-password', {password: password.value}, (data) => {
        if (data == true){
            errPassword.hidden = true
        } else {
            errPassword.hidden = false
        }
    })
}

retype.onchange = () => {
    if (retype.value !== newPassword.value){
        errRetypePassword.hidden = false
    } else {
        errRetypePassword.hidden = true
    }
}

newPassword.onchange = () => {
    if (retype.value !== newPassword.value){
        errRetypePassword.hidden = false
    } else {
        errRetypePassword.hidden = true
    }
}