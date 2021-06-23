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

    constructor(image=null, position=new Vector(), frames=null) {
        this.img = image
        this.pos = position
        this.frames = frames != null ? frames : []
        this.frameNo = 0
        this.time = 0
        this.scale = new Vector({x: 1, y: 1})
        this.enabled = true
    }

    update(dt) {
        if (!this.enabled) {
            return
        }
        this.time -= dt
        while (this.time < 0) {
            ++this.frameNo
            if (this.frameNo == this.frames.length) {
                this.frameNo = 0
            }
            const frameTime = this.frames[this.frameNo].time
            this.time += frameTime
            if (frameTime <= 0) {
                this.enabled = false
                return
            }
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

    invertX(inverted) {
        this.scale.x = inverted ? -1 : 1
    }

    invertY(inverted) {
        this.scale.y = inverted ? -1 : 1
    }

}