const dateConvert=(date)=>{
    var dateinFormat=`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.toLocaleTimeString('en-US')}`
    return dateinFormat
}
const url=`${window.location.origin}/api/test/choose/exams`
fetch(url).then(resp=>resp.json())
.then((back)=>{
    if(back.status)
    {  
        back.data.map((item,index)=>{
            document.querySelector('.tests').insertAdjacentHTML("afterbegin",
            ` <div class="test t${index}">
            <div class="test-wrapper">
                <div class="label test-name">
                    <div class="content">${item.name}</div>
                </div>
                <div class="label test-start">
                    <div class="title">Start Time</div>
                    <div class="content">${dateConvert(new Date(item.startTime))}</div>
                </div>
                <div class="label test-end">
                    <div class="title">End Time</div>
                    <div class="content">${dateConvert(new Date(item.endTime))}</div>
                </div>
                <div class="attempt-container">
                    <div class="button attempt" onclick="location.assign('${window.location.origin}/test/${item._id}')">
                        Attempt
                    </div>
                </div> 
            </div>
        </div>`)
        })
    }
    else
    {
        alert(`${back.error}...Refresh!!`)
    }
})