import Sprite, { Frame } from "./sprite.js"
import Vector from "./vector.js"

export default class {

    constructor() {
        this.animations = new Map()
        this._state = null
        this._sprite = null
        this._speed = new Vector({x: 0, y: 0})
        this._direction = 1
        this._pos = new Vector({x: 30, y: 100})
        this._collision = new Vector({x: 20, y: 23})
    }

    get collision() {
        return this._collision
    }

    get sprite() {
        return this._sprite
    }

    set sprite(name) {
        this._sprite = this.animations.get(name)
    }

    get state() {
        return this._state
    }

    get speed() {
        return new Vector({x: this._speed.x*this._direction, y: this._speed.y})
    }

    set state(name) {
        if (name == this._state) return
        switch(name) {
            case 'stand': {
                if (this._state != 'jump') {
                    this.sprite = 'stand'
                    this._state = name
                    this._speed.y = 0
                }
                this._speed.x = 0
                this._sprite.position = this._pos
                this._sprite.invertX(this._direction < 0)
                this._sprite.reset()
                break
            }
            case 'run': {
                if (this._state != 'jump') {
                    this.sprite = 'run'
                    this._state = name
                    this._speed.y = 0
                }
                this._speed.x = 75
                this._sprite.position = this._pos
                this._sprite.invertX(this._direction < 0)
                this._sprite.reset()
                break
            }
            case 'jump': {
                this._state = name
                this.sprite = 'falling'
                this._sprite.position = this._pos
                this._sprite.invertX(this._direction < 0)
                this._sprite.reset()
                this._speed.y = 150
                break
            }
            case 'falling': {
                this._state = 'jump'
                this.sprite = 'falling'
                this._sprite.position = this._pos
                this._sprite.invertX(this._direction < 0)
                this._sprite.reset()
                break
            }
            case 'landed': {
                this._state = null
                if (this._speed.x == 0) {
                    this.state = 'stand'
                } else {
                    this.state = 'run'
                }
                break
            }
            case 'bumpedTop': {
                this._speed.y = 0
            }
            default: { break }
        }
    }

    set direction(value) {
        if (value == 'left') {
            this._sprite.invertX(true)
            this._direction = -1
        } else if (value == 'right') {
            this._sprite.invertX(false)
            this._direction = 1
        }
    }

    setSprite(name, sprite) {
        this.animations.set(name, sprite)
    }

    update(dt) {
        if (this._state == 'jump') {
            this._speed.y -= 220 * dt / 1000
        }
        this.lastShift = new Vector({
            x: this._speed.x * dt / 1000 * this._direction,
            y: -this._speed.y * dt / 1000,
        })
        this._pos.add(this.lastShift)
        this._sprite.position = this._pos
    }

    load() {
        let image = new Image()

        image.src = 'https://i.pinimg.com/originals/8b/7a/fa/8b7afad6a5db8aeca007d6df748e8cde.png'
        let frames = [
            new Frame({x: 66, y: 3, width: 24, height: 22, time: 1000 / 8}),
            new Frame({x: 91, y: 1, width: 16, height: 24, time: 1000 / 8}),
            new Frame({x: 108, y: 3, width: 21, height: 22, time: 1000 / 8}),
            new Frame({x: 91, y: 1, width: 16, height: 24, time: 1000 / 8}),
        ]
        this.setSprite('run', new Sprite(image, new Vector({x: 0, y: 0}), frames))

        frames = [
            new Frame({x: 1, y: 1, width: 21, height: 24, time: 0}),
        ]
        this.setSprite('stand', new Sprite(image, new Vector({x: 0, y: 0}), frames))

        frames = [
            new Frame({x: 130, y: 1, width: 26, height: 30, time: 0})
        ]
        this.setSprite('falling', new Sprite(image, new Vector({x: 0, y:0}), frames))
    }

}