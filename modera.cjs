const fs = require("node:fs")
const reader = require("rbx-reader")
const buffer = fs.readFileSync("./model.rbxm")
const { result } = reader.parseBuffer(buffer)

let sourceAssetIds = new Set()

function traverse(instance) {
	if (instance.SourceAssetId && instance.SourceAssetId !== "-1") {
		sourceAssetIds.add(instance.SourceAssetId)
	}

	if (instance.Children) {
		for (const child of instance.Children) {
			traverse(child)
		}
	}
}
result.forEach((instance) => {
	traverse(instance)
})

console.log(sourceAssetIds)
