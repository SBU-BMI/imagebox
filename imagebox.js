console.log('imagebox.js loaded')

imagebox=function(){
    // ini
    imagebox.tests()
}

imagebox.msg=function(x){console.log(x)}
imagebox.serviceUrl='http://130.245.124.21:9090/imagebox'
imagebox.imageUrl='http://130.245.124.21:9090/imagebox'
imagebox.tests=function(){
    // some early testing of Erich's server
    this.msg('running some tests ...')
    var box = 'http://130.245.124.21:9090/imagebox'
    var url='https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/gbm/bcr/nationwidechildrens.org/tissue_images/slide_images/nationwidechildrens.org_GBM.tissue_images.Level_1.1.42.0/TCGA-02-0001-01C-01-BS1.0cc8ca55-d024-440c-a4f0-01cf5b3af861.svs'
    var xywh=[3000,8000,1058,1058]


}


imagebox()
