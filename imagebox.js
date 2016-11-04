console.log('imagebox.js loaded')

imagebox=function(){
    // ini
    if(location.hash.length<2){
        //location.hash='http://130.245.124.21:9090/imagebox?url=https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/gbm/bcr/nationwidechildrens.org/tissue_images/slide_images/nationwidechildrens.org_GBM.tissue_images.Level_1.1.42.0/TCGA-02-0001-01C-01-BS1.0cc8ca55-d024-440c-a4f0-01cf5b3af861.svs&xywh=10000,8000,1000,1000'
        //location.hash='http://imagebox-128854.nitrousapp.com:3000/imagebox?url=https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/gbm/bcr/nationwidechildrens.org/tissue_images/slide_images/nationwidechildrens.org_GBM.tissue_images.Level_1.1.42.0/TCGA-02-0001-01C-01-BS1.0cc8ca55-d024-440c-a4f0-01cf5b3af861.svs&xywh=10000,8000,1000,1000&scale=0'
        //location.hash='http://imagebox-128854.nitrousapp.com:3000/imagebox?url=http://openslide.cs.cmu.edu/download/openslide-testdata/Aperio/CMU-1.svs&xywh=8300,19000,1000,1000&scale=0'
        location.hash='http://104.236.248.87:4000/imagebox?url=http://openslide.cs.cmu.edu/download/openslide-testdata/Aperio/CMU-1.svs&xywh=8300,19000,1000,1000&scale=0'
        imagebox.msg('no image target found so the default is being used')
    }
    //sliceURL.innerHTML=""
    //
    //run with hash
    var url=location.hash.slice(1)
    if(!url.match('scale=')){ // default scale if note specified
        url+='&scale=0'
        location.hash=url
    }
    //extract parms
    var urls=url.split('?')
    boxURL.value=urls[0]
    imgURL.value=urls[1].match(/url=[^&]+/)[0].split('=')[1]
    imgCoord.value=urls[1].match(/xywh=[^&]+/)[0].split('=')[1]
    boxURL.onkeyup=imgURL.onkeyup=imgCoord.onkeyup=function(evt){
        if(evt.keyCode==13){ // enter was pressed
        location.hash=boxURL.value+'?url='+imgURL.value+'&xywh='+imgCoord.value+'&scale='+selectScale.value
        imagebox() // re-run imageBox with new parameters
        }
    }
    // get image slice
    var xywh=imgCoord.value.split(',').map(function(ci){return parseFloat(ci)})
    imagebox.msg('geting '+xywh[2]+' x '+xywh[3]+' slice ... remember that the first slice of an image takes longer to retrieve',false,'red')
    imagebox.get(url,imageBoxImg)
    var tic=(new Date)
    imageBoxImg.onload=function(){
        var toc = (new Date)-tic
        imagebox.msg(xywh[2]+'x'+xywh[3]+' slice ('+Math.round(xywh[2]*xywh[3]/1024)+' KB) retrieved in '+toc+' milisecs ('+Math.round(100*xywh[2]*xywh[3]/1024/(1000*toc/1024))/100+' MBs) from a <span style="color:red" id="imgSize">...</span> MB SVS image transfered to box at <span id="transferRate" style="color:red">...</span> MBs',false,'blue')
        sliceURL.innerHTML='<a style="background-color:yellow" href="'+location.hash.slice(1)+'" target="_blank">(open stand-alone slice url in new page)</a>' 
        var imgMeta=function(meta){
            console.log('meta',meta)
            selectScale.innerHTML="" // reset scale
            meta.OME.Image.forEach(function(im,i){
                var scale=urls[1].match(/scale=[^&]+/)[0].split('=')[1]
                if(i==0){
                    var opt=$('<option value='+i+'>'+i+') '+im.Pixels.SizeX+' x '+im.Pixels.SizeY+' size (1:'+Math.round(meta.OME.Image[0].Pixels.SizeX/im.Pixels.SizeX)+'), with '+im.Pixels.PhysicalSizeX+' x '+im.Pixels.PhysicalSizeY+' µm resolution </option>').appendTo(selectScale)[0]
                }else{
                    var scX=Math.round(meta.OME.Image[0].Pixels.SizeX/im.Pixels.SizeX)
                    var scY=Math.round(meta.OME.Image[0].Pixels.SizeY/im.Pixels.SizeY)
                    // check if it is a scaled image or somethign else
                    var scXY=(scX+scY)/2
                    if(Math.log2(scXY)==Math.round(Math.log2(scXY))){
                        var opt=$('<option value='+i+'>'+i+') '+im.Pixels.SizeX+' x '+im.Pixels.SizeY+' size (1:'+scXY+'), with '+meta.OME.Image[0].Pixels.PhysicalSizeX*scX+' x '+meta.OME.Image[0].Pixels.PhysicalSizeY*scY+' µm resolution </option>').appendTo(selectScale)[0]
                    }else{
                        var opt=$('<option value='+i+'>'+i+') '+im.Pixels.SizeX+' x '+im.Pixels.SizeY+' Description: '+im.Description+' </option>').appendTo(selectScale)[0]
                    }
                    //var opt=$('<option value='+i+'>'+i+') '+im.Pixels.SizeX+' x '+im.Pixels.SizeY+' size (1:'+scXY+'), with '+meta.OME.Image[0].Pixels.PhysicalSizeX*scX+' x '+meta.OME.Image[0].Pixels.PhysicalSizeY*scY+' µm resolution </option>').appendTo(selectScale)[0]
                    //var opt=$('<option value='+i+'>'+i+') '+im.Pixels.SizeX+' x '+im.Pixels.SizeY+' size (1:'+sc+'), with '+meta.OME.Image[0].Pixels.PhysicalSizeX*sc+' x '+meta.OME.Image[0].Pixels.PhysicalSizeY*sc+' µm resolution </option>').appendTo(selectScale)[0]
                }
                // select set scale
                if(i==scale){
                    opt.selected=true
                } else {
                    opt.selected=false
                }
                
                //return im.Pixels.SizeX*im.Pixels.SizeY
            })//.reduce(function(a,b){return a+b})
            var size = meta.transfer.filesize
            // listen to scale selection event
            selectScale.onchange=function(){
                location.hash=boxURL.value+'?url='+imgURL.value+'&xywh='+imgCoord.value+'&scale='+selectScale.value
                imagebox()
            }
            imgSize.textContent=Math.round(size/1048576)
            imgSize.style.color='blue'
            transferRate.textContent=Math.round(10*size/1048576/(meta.transfer.time/1000))/10
            transferRate.style.color='blue'
        }
        // get full image information
        //url
        if(!imagebox.meta){imagebox.meta={}}
        if(!imagebox.meta[imgURL.value]){
            $.getJSON(url+'&format=json')
             .then(function(u){
                 imagebox.meta[imgURL.value]=u
                 imgMeta(u)
             })
        }else{imgMeta(imagebox.meta[imgURL.value])}

    }
    imageBoxImg.onerror=function(){
        // maybe error cause by out of range coordinates
        var xywh=imgCoord.value.split(',').map(function(ci){return parseFloat(ci)})
        var sc=parseInt(selectScale.value)
        var im=imagebox.meta[imgURL.value].OME.Image[sc]
        // check origin
        var flag=false
        if(xywh[0]>im.Pixels.SizeX){xywh[0]=0;flag=true}
        if(xywh[1]>im.Pixels.SizeY){xywh[1]=0;flag=true}
        if((xywh[2]+xywh[0])>im.Pixels.SizeX){
            xywh[2]=im.Pixels.SizeX-xywh[0]
            flag=true
        }
        if((xywh[3]+xywh[1])>im.Pixels.SizeY){
            xywh[3]=im.Pixels.SizeY-xywh[1]
            flag=true
        }
        if(flag){
            imgCoord.value=xywh.join(',')
            location.hash=location.hash.replace(/xywh=[^&]*/,'xywh='+imgCoord.value)
            imagebox()
        }
        
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
        extensions: ['.svs'],
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

/* Service configuration info

## Server configuration
../jdk1.8.0_60/bin/java -jar W3Cmf-3.jar 500000 10

(The first parm is min megabytes before clearing of queue files and the second is max cache files)

## Docker setting configuration
1. docker pull sbubmi/imagebox:latest
2. docker run --name imagebox1 -it -v /Users/jonasalmeida/MIS/image-cache:/imagebox -p 4000:3000 -d sbubmi/imagebox:latest
(in this case mapping internal port 3000 to external 4000)

*/

