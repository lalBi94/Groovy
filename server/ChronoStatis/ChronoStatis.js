import { red, magenta, cyan } from "console-log-colors";

/**
 * @desc Local API
 * @author Bilal Boudjemline
 * */
export default class ChronoStatis {
    constructor(api) {
        try {
            this.api = api
            console.log(cyan("?ChronoStatis ::Loaded [OK]"))
        } catch(err) {
            console.log(red(err))
        }
    }

    /**
     * @desc Get all items when the machine start.
     * @return {{}} The items without audio.
     * */
    async getItemsShop() {
        console.log(magenta("?Server ::Items loaded [100%]"))
        const data = await this.api.getItems()

        await data.forEach((e) => {
            e.imgtype = this.getTypeOfArrayBuffer(e.img)
            e.b64 = this.encode64(e.img)
            e.img = null
            e.haveAudio = e.audio ? true : false
            e.audio = null
        })

        return data
    }

    /**
     * @desc Get the time of file.
     * @param { Buffer } buffer The buffer.
     * @return { string } The type.
     * */
    getTypeOfArrayBuffer(buffer) {
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            return 'image/png';
        } else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
            return 'image/jpeg';
        } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
            return 'image/gif';
        } else if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
            return 'audio/mpeg';
        } else if (buffer[0] === 0x66 && buffer[1] === 0x4C && buffer[2] === 0x61 && buffer[3] === 0x43) {
            return 'audio/flac';
        } else if (buffer[0] === 0x4F && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53) {
            return 'audio/ogg';
        } else {
            console.log('Type de fichier non pris en charge');
            return null;
        }
    }

    /**
     * @param { Buffer } buffer The String to convert
     * @desc Convert str to base64
     * @return { string } The result.
     * */
    encode64(buffer) {
        const b = Buffer.from(buffer, 'utf-8');
        return b.toString('base64');
    }
}