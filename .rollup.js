import resolve from "@rollup/plugin-node-resolve"
import cjsEs from "rollup-plugin-cjs-es"

export default {
	input: [
		"client/websockel.js",
		"client/timesync.js",
		"client/player.js"
	],
	output: {
		dir: "public",
		format: "es"
	},
	plugins: [
		resolve(),
		cjsEs({ nested: true})
	]
}
