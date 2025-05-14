class IFTMTextParseError extends Error {
    constructor(errid, extra=null) {
        const lang = navigator.language || navigator.userLanguage;
        const msgs = {
            'pt-BR': {
                0: 'Erro de análise do arquivo iftm: formato inadequado.',
                1: 'Erro de análise do arquivo iftm: largura ou altura inválida.',
                2: `Erro de análise do arquivo iftm: ${extra} é um hexcode inválido de cor.`,
                3: 'Erro de análise do arquivo iftm: o tamanho do mapa da imagem está incorreto.',
                4: `Erro de análise do arquivo iftm: a cor ${extra} não está registrada.`,
                5: `Erro de análise do arquivo iftm: o índice ${extra} deve ser um valor inteiro (>0).`
            },
            'en-US': {
                0: 'IFTM parsing error: invalid format.',
                1: 'IFTM parsing error: width or height invalid.',
                2: `IFTM parsing error: ${extra} is an invalid color hexcode.`,
                3: 'IFTM parsing error: image map size is not correct.',
                4: `IFTM parsing error: the color ${extra} is not recorded.`,
                5: `IFTM parsing error: index ${extra} must be integer (>0).`
            }
        }
        const message = (msgs[lang] !== undefined) ? 
                                msgs[lang][errid] : 
                                msgs['en-US'][errid];
        super(message);
        this.name = "IFTMTextParseError";
    }
}
function cssHexToNumber(cssHex) {
    if(CSS.supports('color', cssHex)) {
        let hex = cssHex.replace("#", "");
        if (hex.length < 5) {
            if (hex.length === 3) hex += 'F';
            hex = hex.split("").map(c => c + c).join("");
        }
        else if (hex.length < 8) hex += 'FF';
        return parseInt(hex, 16);
    }
    return 0x0;
}
class IFTM {
    /*
     * builds IFTM as an object to be read by IFTMRenderer
     * raises IFTMTextParseError
     */
    constructor(textcontent, errcallback=null) {
        // input textcontent: str
        try {
            this._parseFromText(textcontent);
        } catch (error) {
            console.log(error.message);
            if(errcallback != null) errcallback(error.message);
        }
    }
    _parseFromText(text) {
        text = text.trimStart();
        text = text.trimEnd();
        let units = text.split(/\s+/).filter(word => word !== "");
        let i = 0;
        if(units.length < 3) {
            throw new IFTMTextParseError(0);
        }
        this.w = Number(units[i++]);
        this.h = Number(units[i++]);
        if(!Number.isInteger(this.w) || !Number.isInteger(this.h)) {
            throw new IFTMTextParseError(1);
        }
        this.palette = []
        for(; units[i].length > 1 && units[i][0] === '#'; i++) {
            if(!CSS.supports('color', units[i]))
                throw new IFTMTextParseError(2, units[i]);
            this.palette.push(cssHexToNumber(units[i]));
        }
        if((units.length-i) != (this.w * this.h)) {
            throw new IFTMTextParseError(3);
        }
        let row = 0;
        let col = 0;
        this.imgmap = [[]]
        for(; i < units.length; i++) {
            const colorref = this.indexToColor(units[i]);
            this.imgmap[row].push(colorref);
            col++;
            if(col == this.w && this.imgmap.length < this.h) {
                col = 0;
                row++;
                this.imgmap.push([]);
            }
        }
    }
    indexToColor(indexStr) {
        const index = Number(indexStr);
        if(Number.isInteger(index) && index > -1) {
            const i = index - 1;
            if(i < 0) return 0x0;
            if(!(i in this.palette))
                throw new IFTMTextParseError(4, indexStr);
            return this.palette[i];
        }
        throw new IFTMTextParseError(5, index);
    }
    debug() {
        console.log('Debugging IFTM');
        console.log(`Image size: ${this.w} x ${this.h}.`);
        console.log('Color palette:');
        console.log(this.palette);
        console.log('Image map:');
        console.log(this.imgmap);
    }
}
const extractRGBA = (colorref) => ({
    r: (colorref >> 24) & 0xFF,
    g: (colorref >> 16) & 0xFF,
    b: (colorref >> 8) & 0xFF,
    a: (colorref & 0xFF)/255.0
});
class IFTMRenderer {
    /* 
     * class that apply colorref information to a html canvas 
     * element. The default pixelSize is 1 and should never be 
     * less than 1. 
     */
    constructor(iftmObj, imgElem, pixelSize=1) {
        this.iftmObj = iftmObj;
        this.imgElem = imgElem;
        this.pixelSize = pixelSize;
        this.update();
    }
    update() {
        let c = document.createElement('canvas');
        c.width = this.iftmObj.w * this.pixelSize;
        c.height = this.iftmObj.h * this.pixelSize;
        document.body.appendChild(c);
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        for(let y = 0; y < this.iftmObj.h; y++) {
            for(let x = 0; x < this.iftmObj.w; x++) {
                const {r, g, b, a} = extractRGBA(this.iftmObj.imgmap[y][x]);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                ctx.fillRect(x*this.pixelSize, y*this.pixelSize, this.pixelSize, this.pixelSize);
            }
        }
        this.imgElem.src = c.toDataURL('image/png');
        c.remove();
    }
}
function setUpIFTMViewerFromFilepath(file, imgElemId, autoPixelSize=false,
            onreadycallback=null, errcallback=null) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const iftm = new IFTM(e.target.result, errcallback);
        const imgElem = document.getElementById(imgElemId);
        if(autoPixelSize) {
            const pixelSize = ((iftm.w * iftm.h) < 4096) ? 20 : 1;
            new IFTMRenderer(iftm, imgElem, pixelSize);
        }
        else {
            new IFTMRenderer(iftm, imgElem);
        }
        onreadycallback();
    }
    reader.readAsText(file)
}