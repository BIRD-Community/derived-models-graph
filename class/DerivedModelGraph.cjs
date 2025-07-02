const fs = require("node:fs")
const reader = require("rbx-reader")

class DerivedModelGraph {
	/** */
	static traverse(instance, set) {
		if (instance.SourceAssetId && instance.SourceAssetId !== "-1") {
			set.add(instance.SourceAssetId)
		}

		if (instance.Children) {
			for (const child of instance.Children) {
				DerivedModelGraph.traverse(child, set)
			}
		}
	}

	static scanModel(modelPazh) {
		const buffer = fs.readFileSync(modelPazh)
		const { result } = reader.parseBuffer(buffer)
		const sourceAssetIds = new Set()

		result.forEach((instance) => {
			this.traverse(instance, sourceAssetIds)
		})

		return sourceAssetIds
	}
}

module.exports = {
	DerivedModelGraph,
}
