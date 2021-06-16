var eyestatus = true
var userValid = true
var emailValid =false
window.onload=()=>{
    document.querySelector('.input.name').focus()
}
const eyechange = (me) => {
    if (eyestatus) {
        me.innerHTML = '<i class="fas fa-eye-slash"></i>'
        eyestatus = false
        document.querySelector('.input.password').type = 'text'
    }
    else {
        me.innerHTML = '<i class="fas fa-eye"></i>'
        eyestatus = true
        document.querySelector('.input.password').type = 'password'
    }
}
const checkme = async (val) => {
    val=val.trim()
    if(val==='' || !emailValid){return}
    const url = `${window.location.origin}/api/user/check/${val}`
    await fetch(url)
        .then((Response) => Response.json())
        .then((back) => {
            console.log(back)
            if (back.status) {
                userValid = true
                document.querySelector('.error-message').innerHTML = ''
            }
            else if (!back.status && back.code==103) {
                userValid = false
                document.querySelector('.input.email').focus()
                document.querySelector('.error-message').innerHTML = "Account already exists"
            }
            else {
                userValid = false
                console.error('Try again...Server Error')
            }
        })
}
const validEmail=(email)=>{
    var mailformat = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/
    if(email.value.match(mailformat))
    {
        email.style.color='#444'
        emailValid=true
        return true;
    }
    else
    {
        email.focus()
        email.style.color='red'
        emailValid=false
        return false;
    }
}
const errorMessage=(message, code)=>{
    var error=document.querySelector('.error-message')
    error.innerHTML=message
}
const clearForm=()=>{
    var input=document.getElementsByTagName('input');
    input.value=''
    document.getElementsByTagName('select').value='Role'
}
const submit = async (btn) => {
    btn.style.display = 'none'
    document.querySelector('.loading').style.display = 'block'
    var data={}
    data.name=document.querySelector('.input.name').value
    data.role=document.querySelector('.input.role').value
    data.email=document.querySelector('.input.email').value
    data.password=document.querySelector('.input.password').value
    for(x in data)
    {
        if(data[x]===''||data.role==='Role')
        {
            alert('Fill up the empty fields')
            btn.style.display = 'block'
            document.querySelector('.loading').style.display = 'none'
            return
        }
    }
    if(!emailValid){

        alert('Enter a valid email')
        btn.style.display = 'block'
        document.querySelector('.loading').style.display = 'none'
        return
    }
    if(!userValid){
        alert('Plase change the email as it is already registered!!')
        btn.style.display = 'block'
        document.querySelector('.loading').style.display = 'none'
        return
    }
    const url=`${window.location.origin}/api/user/signup`
    await fetch(url,{
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then((Response)=>Response.json())
    .then((back)=>{
        console.log(back)
        if(back.status)
        {
            clearForm()
            location.assign(`${window.location.origin}/login`)
        }
        else
        {
            errorMessage(back.error, back.code)
            btn.style.display = 'block'
            document.querySelector('.loading').style.display = 'none'
        }
    })
}