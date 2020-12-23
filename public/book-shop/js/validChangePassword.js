const password = document.getElementById('newPassword')
const retype = document.getElementById('retype')
const errPassword = document.getElementById('errPassword')

const validateForm = () => {
    if (retype.value !== password.value){
        return false;
    }
    return true;
}

retype.onchange = () => {
    if (retype.value !== password.value){
        errPassword.hidden = false
    } else {
        errPassword.hidden = true
    }
}

password.onchange = () => {
    if (retype.value !== password.value){
        errPassword.hidden = false
    } else {
        errPassword.hidden = true
    }
}