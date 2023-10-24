class MediaFactory {

    constructor (mediaObj) {
        this._id = mediaObj.id;
        this._photographerId = mediaObj.photographerId;
        this._title = mediaObj.title;
        this._likes = mediaObj.likes;
        this._date = mediaObj.date;
        this._price = mediaObj.price;
    }
    get type(){
        return this._type;
    }

    get title(){
        return this._title;
    }

    get id(){
        return this._id;
    }
    get photographerId(){
        return this._photographerId;
    }
    get likes(){
        return this._likes;
    }

    set likes(newValue) {
        return this._likes = newValue;
    }

    get date(){
        return this._date;
    }
    get price() {
        return this._price;
    }
    
}

class Video extends MediaFactory {
    constructor (mediaObj) {
        super(mediaObj);
        this._video = mediaObj.video;
    }

    get content() {
        return `assets/images/${this._video}`;
    }
    
}

class Image extends MediaFactory {
    constructor (mediaObj) {
        super(mediaObj);
        this._image = mediaObj.image;
    }
    get content() {
        return `assets/images/${this._image}`;
    }
 
}

async function mediaExist(url){
    const pro = await fetch(url);
    // console.log(pro);
    // console.log(pro.ok);
    if (pro.ok){
        return true
    }else{
        throw new Error("url media doesn't existed");
    }
    // return
}

const factory = (mediaObj) => {
    // try {
    //     let type;
    
    // if (!mediaObj) {
    //     throw new Error ('type media not found');
    // }else{
    //     if (mediaObj.image) {
               
               
    //             type = "image";
    //             const image = new Image(mediaObj);
    //             image._type = type;
    //             // console.log(image.content);
    //             if(mediaExist(image.content));
    //             console.log(image);
    //             return image;
    //         } 
    //         if (mediaObj.video) {
    //             type = "video";
    //             const video = new Video(mediaObj);
    //             video._type = type;
    //             if(mediaExist(video.content));
    //             return video;
    //         } 
    // }


    if (mediaObj.image && mediaObj.image.length > 0) {     
        type = "image";
        const image = new Image(mediaObj);
        image._type = type;
        return image;
    } 
    if (mediaObj.video && mediaObj.video.length > 0) {
        type = "video";
        const video = new Video(mediaObj);
        video._type = type;
        return video;
    } 
    
    throw new Error ('type media not found');
    // }catch(e){
    //     console.error(e)
    // }
}