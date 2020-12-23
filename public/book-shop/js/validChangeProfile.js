const file = document.getElementById('file')
const errExtension = document.getElementById('errExtension')
const errSize = document.getElementById('errSize')

const validateForm = () => {
    if (!isValidExtension()){
        return false;
    }
    if (!isValidSize()){
        return false;
    }
    return true;
}

const isValidExtension = () => {
    let filePath = file.value; 
    // Allowing file type 
    let allowedExtensions =  
            /(\.jpg|\.jpeg|\.png)$/i; 
      
    if (!allowedExtensions.exec(filePath)) {
        file.value = '';
        errExtension.style.visibility = 'visible'
        return false; 
    }
    errExtension.style.visibility = 'hidden'
    return true; 
}

const isValidSize = () => {
    if (file.files[0].size > 2000000){
        errSize.style.visibility = 'visible'
        return false;
    }
    errSize.style.visibility = 'hidden'
    return true;
}