import Vector from './vector.js'
import Sprite from './sprite.js'
import { Frame } from './sprite.js'

export class Engine {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false
        this.timestamp = Date.now()
        this.drawTimestamp = 0
        this.velocity = {x: 30, y: 0}
        this.sprite = new Sprite()
        this.scale = 4
    }

    prepare() {
        let sprites = new Image()
        sprites.src = 'https://image.freepik.com/free-vector/eskimo-boy-game-sprites_7814-535.jpg'
        let frameTime = 1000 / 10
        let frames = [
            new Frame({x: 54, y: 161, width: 55, height: 95, time: frameTime}),
            new Frame({x: 150, y: 162, width: 55, height: 94, time: frameTime}),
            new Frame({x: 240, y: 162, width: 58, height: 94, time: frameTime}),
            new Frame({x: 332, y: 161, width: 56, height: 95, time: frameTime}),
            new Frame({x: 425, y: 162, width: 55, height: 94, time: frameTime}),
            new Frame({x: 517, y: 162, width: 55, height: 94, time: frameTime}),
        ]
        this.sprite.image = sprites
        this.sprite.position = {x: 0, y: 100}
        this.sprite.addFrames(frames)
    }

    run() {
        this.interval = setInterval(() => this.compute(), 1000 / 30)
    }

    compute() {
        let timestamp = Date.now()
        let delta = (timestamp - this.timestamp)
        this.timestamp = timestamp
        
        let tVec = new Vector({
            x: this.velocity.x * delta / 1000,
            y: -this.velocity.y * delta / 1000,
        })
        this.sprite.move(tVec)

        if (this.sprite.position.x * this.scale >= this.canvas.width) {
            this.sprite.move({x: -this.canvas.width / this.scale})
        }

        window.requestAnimationFrame((timestamp) => this.draw(timestamp))
    }

    draw(timestamp) {
        if (this.drawTimestamp == 0) {
            this.drawTimestamp = timestamp
        }
        let delta = timestamp - this.drawTimestamp
        this.drawTimestamp = timestamp
        this.sprite.update(delta)

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const frame = this.sprite.frameData
        const position = this.sprite.position
        this.ctx.drawImage(this.sprite.image,
            frame.x, frame.y, frame.width, frame.height,
            Math.floor(position.x*this.scale), Math.floor(position.y*this.scale), frame.width*this.scale, frame.height*this.scale
        )
    }

}