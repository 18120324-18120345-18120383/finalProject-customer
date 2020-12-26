const file = document.getElementById('file')
const btnImg = document.getElementById('btnImg')
const errExtension = document.getElementById('errExtension')
const errSize = document.getElementById('errSize')
const notifUploadSuccess = document.getElementById('notifUploadSuccess')

const validateForm = () => {
    if (file.value == ''){
        return true;
    }
    if (!isValidExtension()){
        return false;
    }
    if (!isValidSize()){
        return false;
    }
    return true;
}

file.onchange = () => {
    uploadSuccess();
    isValidExtension();
    isValidSize();
}

const uploadSuccess = () => {
    notifUploadSuccess.hidden = false;
    notifUploadSuccess.innerHTML = '<p class="text-success">Upload successfully: ' + file.value + '</p>'
}

const isValidExtension = () => {
    let filePath = file.value;
    // Allowing file type 
    let allowedExtensions =  
            /(\.jpg|\.jpeg|\.png)$/i; 
      
    if (!allowedExtensions.exec(filePath)) {
        file.value = '';
        errExtension.hidden = false
        notifUploadSuccess.hidden = true
        return false; 
    }
    errExtension.hidden = true
    return true; 
}

const isValidSize = () => {
    if (file.files[0].size > 2000000){
        errSize.hidden = false
        notifUploadSuccess.hidden = true
        return false;
    }
    errSize.hidden = true
    return true;
}