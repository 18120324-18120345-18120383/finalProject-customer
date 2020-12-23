const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const retype = document.getElementById('retype')
const errUsername = document.getElementById('errUsername')
const errPassword = document.getElementById('errPassword')

const validateForm = () => {
    if (retype.value !== password.value){
        return false;
    }
    if (checkValidUsername(username.value) == false){
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

username.onchange = () => {
    usernameVal = username.value;
    if (checkValidUsername(usernameVal) == false){
        errUsername.hidden = false
    } else {
        errUsername.hidden = true
    }
}

const checkValidUsername = (usernameVal) => {

    //Check each character of usenameVal if they are valid or not
    let size = usernameVal.length;
    
    for (let i = 0; i < size; i++){
        if (checkValidChar(usernameVal.charCodeAt(i)) == false){
            return false;
        }
    }

    return true;
}
const checkValidChar = (charCode) => {

    //Username just contain alphabet a - z, capital alphabet A - Z and number 0 - 9

    if (charCode >= 48 && charCode <= 57) //48: '0' - 57: '9'
    {
        return true;
    }
    if (charCode >= 65 && charCode <= 90) //65: 'A' - 90: 'Z'
    {
        return true;
    }
    if (charCode >= 97 && charCode <= 122) //97: 'a' - 122: 'z'
    {
        return true;
    }
    
    return false;
}