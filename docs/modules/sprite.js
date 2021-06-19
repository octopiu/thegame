import Vector from './vector.js'

export class Frame {

    constructor({x, y, width, height, time}) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.time = time
    }

}

export default class {

    constructor(image=null, position=new Vector()) {
        this.img = image
        this.pos = position
        this.frames = []
        this.frameNo = 0
        this.time = 0
    }

    update(dt) {
        this.time -= dt
        while (this.time < 0) {
            ++this.frameNo
            if (this.frameNo == this.frames.length) {
                this.frameNo = 0
            }
            this.time += this.frames[this.frameNo].time
        }
    }

    get frameData() {
        return this.frames[this.frameNo]
    }

    get image() {
        return this.img
    }

    set image(image) {
        this.img = image
    }

    get position() {
        return this.pos
    }

    set position({x, y}) {
        [this.pos.x, this.pos.y] = [x, y]
    }

    move({x=0, y=0}={}) {
        this.pos.add({x, y})
    }

    reset() {
        this.time = 0
        this.frameNo = 0
    }

    addFrames(frames) {
        this.frames = this.frames.concat(frames)
    }

}