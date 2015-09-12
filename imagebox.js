console.log('imagebox.js loaded')

imagebox=function(){
    // ini
}

imagebox.msg=function(x){console.log(x)}
imagebox.box='http://130.245.124.21:9090/imagebox'
imagebox.get=function(url,img){
    if(!img){img = document.createElement('img')}
    if(!url){url='http://130.245.124.21:9090/data/tcga_data/tumor/blca/bcr/nationwidechildrens.org/tissue_images/slide_images/nationwidechildrens.org_BLCA.tissue_images.Level_1.113.1.0/TCGA-BL-A13I-01A-01-BSA.svs?xywh=5500,16000,1000,1000'}
    img.src=url
    return img
}



imagebox()
