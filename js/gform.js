var script = document.querySelector('.frame').value
document.querySelector('.google-form').insertAdjacentHTML("beforeend", script)
document.getElementsByTagName('iframe')[0].className = 'form'
var end=new Date(document.querySelector('.end').value)
var timeLimit=document.querySelector('.timeLimit').value
timeLimit=(timeLimit==='true')
if(timeLimit){
    var x = setInterval(function () {
        var distance = end - new Date()
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var outputString = `${days}d ${hours}h ${minutes}m ${seconds}s`
        document.querySelector('.content').innerHTML = outputString
        if (distance <= 0) {
            clearInterval(x);
            location.assign(`${window.location.origin}`)
        }
        else if(distance <= (5*60*1000)){
            document.querySelector('.content').style.color='red'
        }
        }, 1000)
}
else
{
    document.querySelector('.right').innerHTML=''
}