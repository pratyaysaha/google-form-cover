var alltests=[]
const replace=(str)=>{
    var script= str.value;
    script=script.replace(/\"/g, "'")
    str.value=script 
}
const clearInput=()=>{
    document.querySelector('.input.name').value=''
    document.querySelector('.input.link').value=''
    document.querySelector('.input.startTime').value=''
    document.querySelector('.input.endTime').value=''
}
const dateConvert=(date)=>{
    var dateinFormat=`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.toLocaleTimeString('en-US')}`
    return dateinFormat
}
const refreshTests=async()=>{
    const userId=document.querySelector('.input.userid').value
    const url=`${window.location.origin}/api/test/${userId}`
    await fetch(url).then(resp=>resp.json())
    .then((back)=>{
        if(back.status)
        {
            alltests=back.data
            document.querySelector('.tests').remove()
            document.querySelector('.test-container').insertAdjacentHTML("beforeend",`<div class="tests"></test>`)
            back.data.map((item,index)=>{
                document.querySelector('.tests').insertAdjacentHTML("afterbegin",
                ` <div class="test t${index}">
                <div class="test-wrapper">
                    <div class="test-label test-name">
                        <div class="test-content">${item.name}</div>
                    </div>
                    <div class="test-label test-start">
                        <div class="test-title">Start Time</div>
                        <div class="test-content">${dateConvert(new Date(item.startTime))}</div>
                    </div>
                    <div class="test-label test-end">
                        <div class="test-title">End Time</div>
                        <div class="test-content">${dateConvert(new Date(item.endTime))}</div>
                    </div>
                    <div class="button-container admin" style="width: 100%;">
                        <div class="button-container-left">
                            <div class="delete" title="Delete this Quiz" onclick="deleteButton('${index}')">
                                <i class="fas fa-trash-alt"></i>
                            </div>
                            <div class="edit" title="Edit this Quiz" onclick="updateButton2('${index}')">
                                <i class="fas fa-pencil-alt"></i>
                            </div>
                            <div class="preview" title="Teacher Preview (open always)" onclick="location.assign('${window.location.origin}/test/${item._id}')">
                                <i class="far fa-eye"></i>
                            </div>
                        </div>
                        <div class="button-container-right" style="font-size: 18px;">
                            <div class="button" onclick="assignButton('${index}')">
                                Assign
                            </div>
                        </div>
                    </div> 
                </div>
            </div>`)
            })
        }
        else
        {
            alert('Error..Refresh the page!!')
        }
    })
}
window.onload=refreshTests
const createTest=async()=>{
    const data={}
    data.name=document.querySelector('.input.name').value
    data.link=document.querySelector('.input.link').value
    data.startTime= new Date(document.querySelector('.input.startTime').value)
    data.endTime=new Date(document.querySelector('.input.endTime').value)
    data.userId=document.querySelector('.input.userid').value
    console.log(data)
    for(x in data)
    {
        if(data[x]==='')
        {
            alert('Fill up the empty slots')
            return
        }
    }
    const url=`${window.location.origin}/api/test/new`
    await fetch(url,{
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(resp=>resp.json())
    .then((back)=>{
        if(back.status)
        {
            clearInput()
            refreshTests()
            alert('Test Created...Assign the test.')
        }
        else
        {
            alert('Error..Try Again!!!!')
        }
    })
}
const changeToformat=(now)=>{
    const usefulStr = `${now.getFullYear()}-${(now.getMonth()+1 <10)? `0${now.getMonth()+1}` : `${now.getMonth()+1}`}-${now.getDate()<10 ? `0${now.getDate()}`: `${now.getDate()}`}T${now.getHours() <10 ? `0${now.getHours()}`: `${now.getHours()}`}:${now.getMinutes()<10?`0${now.getMinutes()}`: `${now.getMinutes()}`}`
    return usefulStr
}
const updateButton2=(index)=>{
    const item=alltests[index];
    if(document.querySelector('.button.cancel')===null)
        document.querySelector('.button-container-right.create').insertAdjacentHTML("afterbegin",`<div class="button cancel" onclick="cancel()">Cancel</div>`)
    document.querySelector('.admin-title').innerHTML='Update Quiz'
    document.querySelector('.button.create').innerHTML='Update'
    document.querySelector('.button.create').setAttribute("onclick","updateTest()")
    document.querySelector(`.input.name`).focus()
    document.querySelector(`.input.name`).value=item.name
    document.querySelector('.input.link').value=item.link
    document.querySelector('.input.startTime').value=changeToformat(new Date(item.startTime))
    document.querySelector('.input.endTime').value=changeToformat(new Date(item.endTime))
    if(document.querySelector('.input.testid')===null)
        document.querySelector('.admin-wrapper.aw1').insertAdjacentHTML("afterbegin",`<input class="input testid" hidden value=${item._id}/>`)
    else
        document.querySelector('.input.testid').value=item._id
}
const cancel=()=>{
    clearInput()
    document.querySelector('.admin-title').innerHTML='New Quiz'
    document.querySelector('.button.create').innerHTML='Create'
    document.querySelector('.button.create').setAttribute("onclick","createTest()")
    document.querySelector('.button.cancel').remove()
    document.querySelector('.input.testid').remove()
}
const updateTest=async ()=>{
    const data={}
    data.name=document.querySelector('.input.name').value
    data.link=document.querySelector('.input.link').value
    data.startTime= new Date(document.querySelector('.input.startTime').value)
    data.endTime=new Date(document.querySelector('.input.endTime').value)
    const testId=document.querySelector('.input.testid').value
    console.log(data)
    for(x in data)
    {
        if(data[x]==='')
        {
            alert('Fill up the empty slots')
            return
        }
    }
    const url=`${window.location.origin}/api/test/${testId}`
    await fetch(url,{
        method: 'PATCH',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(resp=>resp.json())
    .then((back)=>{
        if(back.status)
        {
            cancel()
            refreshTests()
            alert('Test Created...Assign the test.')
        }
        else
        {
            console.log(back)
            alert(`${back.errors}...Try Again!!!!`)
        }
    })
}
const deleteButton=async(index)=>{
    const name=alltests[index].name
    if(!confirm(`Do you want to delete ${name}?`))
    {
        return;
    }
    const testId= alltests[index]._id
    const url=`${window.location.origin}/api/test/${testId}`
    await fetch(url,{
        method: 'DELETE'
    }).then(resp=>resp.json())
    .then((back)=>{
        if(back.status)
        {
            alert('Deleted Successfully')
            document.querySelector(`.test.t${index}`).remove()
        }
        else
        {
            alert(`${back.error}...Try again!!`)
        }
    })
}
const cancelAssignees=()=>{
    document.querySelector('.input.examinees').value=''
    document.querySelector('.input.qname').value=''
    document.querySelector('.admin-wrapper.aw2').style.display='none'
}
const assignButton=async(index)=>{
    const item=alltests[index]
    document.querySelector('.admin-wrapper.aw2').style.display='flex';
    document.querySelector('.input.examinees').focus()
    document.querySelector('.input.testid').value=item._id
    document.querySelector('.input.qname').value=item.name
    if(document.querySelector('.input.examinees').value!=='')
    {
        document.querySelector('.input.examinees').value=''
    }   
    item.examinees.map((email)=>{
        document.querySelector('.input.examinees').value+=`${email}, `
    })
}
const assign=async()=>{
    const testid=document.querySelector('.input.testid').value
    const emails=document.querySelector('.input.examinees').value
    console.log(emails)
    var examinees=emails.toString().split(', ')
    var index=examinees.indexOf("")
    if (index > -1) {
        examinees.splice(index, 1);
    }
    console.log(examinees)
    if(examinees.length===0)
    {
        alert('No examinees');
        return
    }
    var data={}
    data.examinees=examinees
    const url=`${window.location.origin}/api/test/examinees/${testid}`
    await fetch(url,{
        method: 'PATCH',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(resp=>resp.json())
    .then((back)=>{
        if(back.status)
        {
            cancelAssignees()
            refreshTests()
            alert('Updated')
        }
        else
        {
            alert(`${back.error}...Try Again!!!`)
        }
    })
}