console.log('imagebox.js loaded')

imagebox=function(){
    // ini
    if(location.hash.length<2){
        //location.hash='http://130.245.124.21:9090/imagebox?url=https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/gbm/bcr/nationwidechildrens.org/tissue_images/slide_images/nationwidechildrens.org_GBM.tissue_images.Level_1.1.42.0/TCGA-02-0001-01C-01-BS1.0cc8ca55-d024-440c-a4f0-01cf5b3af861.svs&xywh=10000,8000,1000,1000'
        location.hash='http://jonasalmeida-8342.nitrouspro.com:32776/imagebox?url=https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/gbm/bcr/nationwidechildrens.org/tissue_images/slide_images/nationwidechildrens.org_GBM.tissue_images.Level_1.1.42.0/TCGA-02-0001-01C-01-BS1.0cc8ca55-d024-440c-a4f0-01cf5b3af861.svs&xywh=10000,8000,1000,1000&scale=0'
        imagebox.msg('no image target found so the default is being used')
    }
    //sliceURL.innerHTML=""
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
    imagebox.msg('geting '+xywh[2]+' x '+xywh[3]+' slice ... remember first slice of an image takes longer to retrieve',false,'red')
    imagebox.get(url,imageBoxImg)
    var tic=(new Date)
    imageBoxImg.onload=function(){
        var toc = (new Date)-tic
        imagebox.msg(xywh[2]+' x '+xywh[3]+' slice ('+Math.round(xywh[2]*xywh[3]/1024)+' KB) retrieved in '+toc+' milisecs ('+Math.round(100*xywh[2]*xywh[3]/1024/(1000*toc/1024))/100+' Mbs) from a <span style="color:red" id="imgSize">...</span> Mb SVS image transfered to box at <span id="transferRate" style="color:red">...</span> Mbs',false,'blue')
        sliceURL.innerHTML='<a style="background-color:yellow" href="'+location.hash.slice(1)+'" target="_blank">(open in new page)</a>' 
        var imgMeta=function(meta){
            console.log('meta',meta)
            selectScale.innerHTML="" // reset scale
            var size=meta.OME.Image.map(function(im,i){
                var opt=$('<option value='+i+'>'+i+') '+im.Pixels.SizeX+' x '+im.Pixels.SizeY+' size (1:'+Math.round(meta.OME.Image[0].Pixels.SizeX/im.Pixels.SizeX)+'), with '+im.Pixels.PhysicalSizeX+' x '+im.Pixels.PhysicalSizeY+' µm resolution </option>').appendTo(selectScale)[0]
                return im.Pixels.SizeX*im.Pixels.SizeY
            }).reduce(function(a,b){return a+b})
            imgSize.textContent=Math.round(size/12024/1024)
            imgSize.style.color='blue'
            4
            
        }
        // get full image information
        url
        if(!imagebox.meta){imagebox.meta={}}
        if(!imagebox.meta[imgURL.value]){
            $.getJSON(url+'&format=meta')
             .then(function(u){
                 imgMeta(u)
             })
        }else{imgMeta(imagebox.meta[imgURL.value])}

    }
    // support for Boxes
    if(!imagebox.boxCom.buttonLoaded){
        imagebox.boxCom()
    }
    if(!imagebox.dropBox.buttonLoaded){
        imagebox.dropBox()
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
imagebox.dropBox=function(){ // add dropbox support
    imagebox.dropBox.buttonLoaded=true
    var options = {
        // Required. Called when a user selects an item in the Chooser.
        success: function(files) {
            //alert("Here's the file link: " + files[0].link)
            imagebox.readFileUrl(files[0].link)
        },

        // Optional. Called when the user closes the dialog without selecting a file
        // and does not include any parameters.
        cancel: function() {

        },

        // Optional. "preview" (default) is a preview link to the document for sharing,
        // "direct" is an expiring link to download the contents of the file. For more
        // information about link types, see Link types below.
        linkType: "direct", // or "direct"

        // Optional. A value of false (default) limits selection to a single file, while
        // true enables multiple file selection.
        multiselect: false, // or true

        // Optional. This is a list of file extensions. If specified, the user will
        // only be able to select files with these extensions. You may also specify
        // file types, such as "video" or "images" in the list. For more information,
        // see File types below. By default, all extensions are allowed.
        //extensions: ['.svs'],
    };

    var button = Dropbox.createChooseButton(options);
    document.getElementById("dropBoxContainer").appendChild(button);
}
imagebox.boxCom=function(){
    $.getScript("https://app.box.com/js/static/select.js").then(function(){
        imagebox.boxCom.buttonLoaded=true
        $(document).ready(function(){
            var boxSelect = new BoxSelect();
            // Register a success callback handler
            boxSelect.success(function(response) {
                //console.log(response);
                imagebox.readFileUrl(response[0].url)
            });
            // Register a cancel callback handler
            boxSelect.cancel(function() {
                console.log("The user clicked cancel or closed the popup");
            });
        });
    })
}

imagebox.readFileUrl=function(url){
    imgURL.value=url
    location.hash=boxURL.value+'?url='+imgURL.value+'&xywh=0,0,500,500'
    imagebox()
}



$(document).ready(function(){
    imagebox()
})

