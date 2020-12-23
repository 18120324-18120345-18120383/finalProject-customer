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
        errPassword.style.visibility = "visible"
    } else {
        errPassword.style.visibility = "hidden"
    }
}

password.onchange = () => {
    if (retype.value !== password.value){
        errPassword.style.visibility = "visible"
    } else {
        errPassword.style.visibility = "hidden"
    }
}