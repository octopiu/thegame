import Vector from './vector.js'
import Sprite from './sprite.js'
import { Frame } from './sprite.js'
import Level from './level.js'
import { Side } from './level.js'
import Actor from './actor.js'

export class Engine {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d', {'antialias': false})
        this.ctx.imageSmoothingEnabled = false
        this.timestamp = Date.now()
        this.drawTimestamp = 0
        this.velocity = {x: 30, y: 0}
        // this.sprite = new Sprite()
        this.bricks = new Sprite()
        this.brick = new Sprite()
        this.scale = 1
        this.level = new Level()
        this.actor = new Actor()
        this._inputs = new Map([
            ['left', false],
            ['right', false],
            ['up', false],
        ])
        this._prevInputs = new Map([
            ['left', false],
            ['right', false],
            ['up', false],
        ])
        this.collisionXY = []
    }

    prepare() {
        /* let sprites = new Image()
        // sprites.src = 'https://image.freepik.com/free-vector/eskimo-boy-game-sprites_7814-535.jpg'
        sprites.src = 'https://i.pinimg.com/originals/8b/7a/fa/8b7afad6a5db8aeca007d6df748e8cde.png'
        let frameTime = 1000 / 10
        let frames = [
            new Frame({x: 66, y: 3, width: 24, height: 22, time: 1000 / 8}),
            new Frame({x: 91, y: 1, width: 16, height: 24, time: 1000 / 8}),
            new Frame({x: 108, y: 3, width: 21, height: 22, time: 1000 / 8}),
            new Frame({x: 91, y: 1, width: 16, height: 24, time: 1000 / 8}),
        ]
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
        this.sprite.addFrames(frames) */

        let bricks = new Image()
        bricks.src = '../assets/images/bricks.png'
        let frames = [new Frame({x: 0, y: 0, width: 24, height: 24, time: 0})]
        this.bricks.image = bricks
        this.bricks.addFrames(frames)

        let brick = new Image()
        brick.src = '../assets/images/brick.png'
        frames = [new Frame({x: 0, y: 0, width: 8, height: 8, time: 0})]
        this.brick.image = brick
        this.brick.addFrames(frames)

        this.actor.load()
        this.actor.state = 'stand'

        this.level.load('1')

        document.addEventListener("keydown", (e) => this.inputHandler(e, 'keydown'), false);
        document.addEventListener("keyup", (e) => this.inputHandler(e, 'keyup'), false);
    }

    inputHandler(event, state) {
        if (event.repeat) return
        if (state == 'keyup') {
            switch (event.key) {
                case 'ArrowLeft':
                case 'Left': {
                    this._inputs.set('left', false)
                    break
                }
                case 'ArrowRight':
                case 'Right': {
                    this._inputs.set('right', false)
                    break
                }
            }
            if (!this._inputs.get('left') && !this._inputs.get('right')) {
                this.actor.state = 'stand'
            }
        } else if (state == 'keydown') {
            switch (event.key) {
                case 'ArrowLeft':
                case 'Left': {
                    this._inputs.set('left', true)
                    this.actor.state = 'run'
                    this.actor.direction = 'left'
                    break
                }
                case 'ArrowRight':
                case 'Right': {
                    this._inputs.set('right', true)
                    this.actor.state = 'run'
                    this.actor.direction = 'right'
                    break
                }
                case 'ArrowUp':
                case 'Up': {
                    this._inputs.set('up', true)
                    if (this.actor.state != 'jump') {
                        this.actor.state = 'jump'
                    }
                    break
                }
            }
        }
    }

    run() {
        this.interval = setInterval(() => this.compute(), 1000 / 60)
        // this.compute()
    }

    compute() {
        let timestamp = Date.now()
        let delta = (timestamp - this.timestamp)
        this.timestamp = timestamp

        for (let [k, v] of this._inputs) {
           this._prevInputs.set(k, v)
        }
        this.actor.update(delta)
        this.collisionDetection()

        window.requestAnimationFrame((timestamp) => this.draw(timestamp))
    }

    _getTiles(start, end) {
        let result = []
        for (let x=start.x; x<=end.x; ++x) {
            for (let y=start.y; y<=end.y; ++y) {
                const tile = this.level.tile({x: x, y: y})
                if (tile !== undefined) {
                    result.push(tile)
                }
            }
        }
        return result
    }

    HCollisionDetection() {
        let collisionTiles = []
        this.collisionXY = []
        let topLeft = this.actor._pos
        let bottomRight = new Vector({x: topLeft.x + this.actor._collision.x, y: topLeft.y + this.actor._collision.y})
        let topLeftTile = new Vector({
            x: Math.floor(topLeft.x / 8),
            y: Math.floor(topLeft.y / 8)
        })
        let bottomRightTile = new Vector({
            x: Math.floor(bottomRight.x / 8),
            y: Math.floor((bottomRight.y-0.1) / 8)
        })
        if (this.actor.speed.x > 0) {
            let y = bottomRightTile.y
            collisionTiles = this._getTiles(
                {x: bottomRightTile.x, y: topLeftTile.y},
                {x: bottomRightTile.x, y: y}
            )
            for (const tile of collisionTiles) {
                if (tile.sides.has(Side.Left)) {
                    const newX = bottomRightTile.x * 8 - this.actor._collision.x
                    console.log(Math.abs(newX - this.actor._pos.x).toFixed(2), Math.abs(this.actor.lastShift.x).toFixed(2))
                    if (Math.abs(newX - this.actor._pos.x).toFixed(2) <= Math.abs(this.actor.lastShift.x).toFixed(2)) {
                        this.actor._pos.x = newX
                    } else {
                        continue
                    }
                    return true
                }
            }
        } else {
            let y = bottomRightTile.y
            collisionTiles = this._getTiles(
                {x: topLeftTile.x, y: topLeftTile.y},
                {x: topLeftTile.x, y: y}
            )
            for (const tile of collisionTiles) {
                if (tile.sides.has(Side.Right)) {
                    const newX = topLeftTile.x * 8 + 8
                    if (Math.abs(newX - this.actor._pos.x).toFixed(2) <= Math.abs(this.actor.lastShift.x).toFixed(2)) {
                        this.actor._pos.x = newX
                    } else {
                        continue
                    }
                    return true
                }
            }
        }
        return true
    }

    VCollisionDetection() {
        let collisionTiles = []
        this.collisionXY = []
        let topLeft = this.actor._pos
        let bottomRight = new Vector({x: topLeft.x + this.actor._collision.x, y: topLeft.y + this.actor._collision.y})
        let topLeftTile = new Vector({
            x: Math.floor((topLeft.x) / 8),
            y: Math.floor(topLeft.y / 8)
        })
        let bottomRightTile = new Vector({
            x: Math.floor((bottomRight.x) / 8),
            y: Math.floor(bottomRight.y / 8)
        })
        if (this.actor.speed.y > 0) {
            collisionTiles = this._getTiles(
                {x: topLeftTile.x, y: topLeftTile.y},
                {x: bottomRightTile.x, y: topLeftTile.y}
            )
            for (const tile of collisionTiles) {
                if (tile.sides.has(Side.Bottom)) {
                    this.actor.state = 'bumpedTop'
                    const newY = topLeftTile.y * 8 + 8
                    if (Math.abs(newY - this.actor._pos.y).toFixed(2) <= Math.abs(this.actor.lastShift.y).toFixed(2)) {
                        this.actor._pos.y = newY
                    } else {
                        continue
                    }
                    return false
                }
            }
        } else {
            collisionTiles = this._getTiles(
                {x: topLeftTile.x, y: bottomRightTile.y},
                {x: bottomRightTile.x, y: bottomRightTile.y}
            )
            for (const tile of collisionTiles) {
                if (tile.sides.has(Side.Top)) {
                    const newY = bottomRightTile.y * 8 - this.actor._collision.y
                    if (Math.abs(newY - this.actor._pos.y).toFixed(2) <= Math.abs(this.actor.lastShift.y).toFixed(2)) {
                        if (this.actor.speed.y != 0) {
                            this.actor.state = 'landed'
                        }
                        this.actor._pos.y = newY
                    } else {
                        continue
                    }
                    return true
                }
            }
        }
        return false
    }

    collisionDetection() {
        if (!this.VCollisionDetection()) {
            this.actor.state = 'falling'
        }
        this.HCollisionDetection()
    }

    draw(timestamp) {
        if (this.drawTimestamp == 0) {
            this.drawTimestamp = timestamp
        }
        let delta = timestamp - this.drawTimestamp
        this.drawTimestamp = timestamp

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'red'

        let screenShift = null
        if (this.actor._pos.x > this.canvas.width / 2) {
            screenShift = new Vector({x: this.actor._pos.x - this.canvas.width / 2, y: 0})
        } else {
            screenShift = new Vector()
        }
        let frame = this.brick.frameData
        for (let i=Math.floor(screenShift.x / 8); i < Math.ceil((screenShift.x + this.canvas.width) / 8); ++i) {
            for (let j=0; j < this.canvas.height / 8; ++j) {
                const tile = this.level.tile({x: i, y: j})
                if (tile !== undefined) {
                    this.ctx.drawImage(
                        this.brick.image, frame.x, frame.y, frame.width, frame.height,
                        i*8 - screenShift.x, j*8 - screenShift.y, frame.width, frame.height
                    )
                }
            }
        }

        // this.sprite.update(delta)
        let sprite = this.actor.sprite
        sprite.update(delta)

        this.ctx.strokeRect(this.actor._pos.x - screenShift.x, this.actor._pos.y - screenShift.y,
                      this.actor._collision.x, this.actor._collision.y)

        frame = sprite.frameData
        let position = this.actor._pos
        const scale = sprite.scale
        this.ctx.save()
        this.ctx.scale(scale.x, scale.y)
        this.ctx.drawImage(
            sprite.image, frame.x, frame.y, frame.width, frame.height,
            Math.floor((position.x - screenShift.x)*scale.x), Math.floor((position.y - screenShift.y)*scale.y),
            frame.width*scale.x, frame.height*scale.y
        )
        this.ctx.restore()

        /*this.bricks.position = {x: 0, y: this.canvas.height / this.scale - 24}
        for (let i=0; i<11; ++i) {
            let frame = this.bricks.frameData
            let position = this.bricks.position
            this.ctx.drawImage(
                this.bricks.image, frame.x, frame.y, frame.width, frame.height,
                Math.floor(position.x*this.scale), Math.floor(position.y*this.scale),
                frame.width*this.scale, frame.height*this.scale
            )
            this.bricks.move({x: 24})
        }*/
    }

}