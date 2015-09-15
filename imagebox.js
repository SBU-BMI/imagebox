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
    imagebox.get(url,imageBoxImg)
}

imagebox.msg=function(x,a){
    console.log(x)
    if(a){ // add text flag
        imageBoxMsg.innerHTML+=x
    }else{
        imageBoxMsg.innerHTML=x
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

