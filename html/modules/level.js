import Vector from './vector.js'

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
        for (let i=0; i < data.length / channels; ++i) {
            let val = 0
            for (let j=0; j<channels; ++j) {
                val *= 0x100
                val += data[i*channels + j]
            }
            if (val != 0) {
                this.grid.set(i, val)
            }
        }
    }

    tile({x, y}) {
        const index = this.size.x * y + x
        if (this.grid.has(index)) {
            return this.grid.get(index)
        }
        return 0
    }

}