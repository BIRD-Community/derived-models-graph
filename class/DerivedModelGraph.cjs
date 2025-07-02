const fs = require("node:fs")
const reader = require("rbx-reader")
/** @typedef {import("rbx-reader/dist/Instance").Instance} Instance */

class DerivedModelGraph {
	/**Recursively traverses the model instance tree and collects SourceAssetIds.
	 * @param {Instance} instance - An instance to traverse.
	 * @param {Set} set - The set to collect SourceAssetIds.
	 */
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
	/**Scans a model file for SourceAssetIds.
	 * @param {string} modelPazh - The path to the model file.
	 * @returns {Set} A set of SourceAssetIds found in the model.
	 */
	static scanModel(modelPazh) {
		const buffer = fs.readFileSync(modelPazh)
		const { result } = reader.parseBuffer(buffer)
		const sourceAssetIds = new Set()

		result.forEach((instance) => {
			this.traverse(instance, sourceAssetIds)
		})

		return sourceAssetIds
	}
	/**Scans a directory for model files and collects any unique instances of SourceAssetId.
	 * @param {string} directoryPath - The path to the directory containing model files.
	 * @returns {Map} A map where keys are model file names and values are sets of SourceAssetIds.
	 */
	static scanDirectory(directoryPath) {
		const modelSets = new Map()

		const files = fs.readdirSync(directoryPath)
		for (const file of files) {
			if (file.endsWith(".rbxm")) {
				const modelPath = `${directoryPath}/${file}`
				const modelSourceAssetIds = this.scanModel(modelPath)
				modelSets.set(file, modelSourceAssetIds)
			}
		}

		return modelSets
	}
}

module.exports = {
	DerivedModelGraph,
}
