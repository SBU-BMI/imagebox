console.log('imagebox.js loaded')

imagebox=function(){
    // ini
    if(location.hash.length<2){
        location.hash='http://130.245.124.21:9090/imagebox?url=https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/gbm/bcr/nationwidechildrens.org/tissue_images/slide_images/nationwidechildrens.org_GBM.tissue_images.Level_1.1.42.0/TCGA-02-0001-01C-01-BS1.0cc8ca55-d024-440c-a4f0-01cf5b3af861.svs&xywh=10000,8000,1000,1000'
        imagebox.msg('no image target found so the default is being used')
    }
    //
    //run with hash
    var url=location.hash.slice(1)
    
    //extract parms
    var urls=url.split('?')
    boxURL.value=urls[0]
    imgURL.value=urls[1].match(/url=[^&]+/)[0].split('=')[1]
    imgCoord.value=urls[1].match(/xywh=[^&]+/)[0].split('=')[1]
    boxURL.onkeyup=imgURL.onkeyup=imgCoord.onkeyup=function(evt){
        if(evt.keyCode==13){ // enter was pressed
        location.hash=boxURL.value+'?url='+imgURL.value+'&xywh='+imgCoord.value
        imagebox() // re-run imageBox with new parameters
        }
    }
    // get image slice
    var xywh=imgCoord.value.split(',').map(function(ci){return parseFloat(ci)})
    imagebox.msg('geting '+xywh[2]+' x '+xywh[3]+' slice ...',false,'red')
    imagebox.get(url,imageBoxImg)
    var tic=(new Date)
    imageBoxImg.onload=function(){
        var toc = (new Date)-tic
        imagebox.msg(xywh[2]+' x '+xywh[3]+' slice loaded in '+toc+' milisecs',false,'blue')
    }

}

imagebox.msg=function(x,a,c){
    console.log(x)
    if(a){ // add text flag
        imageBoxMsg.innerHTML+=x
    }else{
        imageBoxMsg.innerHTML=x
    }
    if(c){
        imageBoxMsg.style.color=c
    }else{
        imageBoxMsg.style.color='navy'
    }
}
imagebox.box='http://130.245.124.21:9090/imagebox'
imagebox.get=function(url,img){
    if(!img){img = document.createElement('img')}
    img.src=url
    return img
}


$(document).ready(function(){
    imagebox()
})

