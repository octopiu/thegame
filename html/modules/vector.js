export default class {

    constructor({x=0, y=0}={}) {
        this.x = x
        this.y = y
    }

    length() {
        return Math.sqrt(this.SqrLength())
    }

    sqrLength() {
        return this.x * this.x + this.y * this.y
    }

    add({x=0, y=0}={}) {
        this.x += x
        this.y += y
    }

    scalar({x, y}) {
        return this.x * x + this.y * y
    }

    multiply(k) {
        this.x *= k
        this.y *= k
    }

}