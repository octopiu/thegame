import Vector from './vector.js'

export const Side = Object.freeze({
    Top: 0,
    Left: 1,
    Right: 2,
    Bottom: 3,
})

export class Tile {
    constructor(value) {
        this.sides = new Set()
        this.value = value
    }

    setSides(sides) {
        for (const side of sides) {
            this.sides.add(side)
        }
    }
}

export default class {

    constructor() {
        this.grid = new Map()
        this.size = new Vector({x: 100, y: 30})
    }

    async load(name) {
        let response = await fetch(`../assets/levels/${name}.data`)
        let bin = await response.blob()
        let buffer = await bin.arrayBuffer()
        let data = new Uint8Array(buffer)
        const channels = 3
        const white = 0xffffff
        for (let i=0; i < data.length / channels; ++i) {
            let val = 0
            for (let j=0; j<channels; ++j) {
                val *= 0x100
                val += data[i*channels + j]
            }
            if (val != white) {
                this.grid.set(i, new Tile(val))
            }
        }
        this.compile()
    }

    compile() {
        for (let [i, tile] of this.grid) {
            const x = i % this.size.x
            const y = Math.floor(i / this.size.x)

            const neighbors = new Map([
                [Side.Top, this.tile({x: x, y: y-1})],
                [Side.Bottom, this.tile({x: x, y: y+1})],
                [Side.Left, this.tile({x: x-1, y: y})],
                [Side.Right, this.tile({x: x+1, y: y})],
            ])
            
            let sides = []
            for (const [side, ntile] of neighbors) {
                if (ntile === undefined) {
                    sides.push(side)
                }
            }

            tile.setSides(sides)
        }
    }

    tile({x, y}) {
        if (x < 0 || x > this.size.x || y < 0 || y > this.size.y) {
            return undefined
        }
        const index = this.size.x * y + x
        return this.grid.get(index)
    }

}