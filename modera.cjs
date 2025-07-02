const fs = require("node:fs")
const reader = require("rbx-reader")
const { DerivedModelGraph } = require("./class/DerivedModelGraph.cjs")

console.log(DerivedModelGraph.scanModel("./model.rbxm"))
