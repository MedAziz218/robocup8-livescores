
import {
	type Node,
	type Edge,
	type FitViewOptions,
	useSvelteFlow,
} from '@xyflow/svelte';

import { type TeamData } from '$lib/(components)/flow/team-component.svelte';
let initialNodes: Node[] = []
function closestPower(n: number, p: number) {
	let x = p
	while (x <= n) x *= p;
	return x / p
}
function TournamentRounds(n: number, p: number) {
	let s = 1
	let r = 1
	while (n > 1) {
		r += 1
		s += n
		n = Number((n / p).toFixed(0))
	}
	return { numberOfTotlaMatches: s, numberOfRounds: r }
}
function generateInitialNodes() {
	initialNodes = []
	let team_counter = 0;
	let match_counter = 0;

	let numberOfInitialMatches = closestPower(_numberOfTeams / _matchSize, _matchSize)

	let { numberOfTotlaMatches, numberOfRounds } = TournamentRounds(numberOfInitialMatches, _matchSize);

	FlowState.numberOfInitialMatches = numberOfInitialMatches;
	FlowState.numberOfTotlaMatches = numberOfTotlaMatches;
	FlowState.numberOfRounds = numberOfRounds;

	// add initial rounds

	for (let i = 1; i <= numberOfInitialMatches; i++) {

		let Teams: TeamData[] = []

		for (let j = 1; j <= _matchSize; j++) {
			team_counter++;
			Teams.push({ id: team_counter.toString(), teamName: '-', teamID: team_counter })
		}
		match_counter++;
		initialNodes.push(
			{
				id: match_counter.toString(),
				type: "match",
				data: {
					round: 1,
					matchID: match_counter,
					matchSize: FlowState.matchSize,
					teamsData: Teams
				},
				position: { x: 0, y: 0 },
			},
		)
	}

	for (let r = 2; r <= numberOfRounds; r++) {
		for (let i = 1; i <= _matchSize ** (numberOfRounds - r); i++) {

			let Teams: TeamData[] = []

			for (let j = 1; j <= _matchSize; j++) {
				team_counter++;
				Teams.push({ id: team_counter.toString(), teamName: '-', teamID: -1 })
			}
			match_counter++;
			initialNodes.push(
				{
					id: match_counter.toString(),
					type: "match",
					data: {
						round: r,
						matchID: match_counter,
						matchSize: FlowState.matchSize,
						teamsData: Teams
					},
					position: { x: 0, y: 0 },
				},
			)
		}

	}
}

let initialEdges: Edge[] = [
	{ id: "e1-2", source: "1", target: "2", animated: true },
	{ id: "e2-3", source: "2", target: "3" },
	{ id: "e2-4", source: "2", target: "4" },
	{ id: "e3-5", source: "3", target: "5" },
	{ id: "e4-5", source: "4", target: "5" },
];


const FocusMatchAnimation = $state<FitViewOptions>({
	padding: 0.1,
	includeHiddenNodes: false,
	minZoom: 0.2,
	maxZoom: 2.25,
	duration: 1000
});

type FlowStateType = {
	initialNodes: () => Node[],
	initialEdges: () => Edge[],
	setNodes: ((nodes: Node[]) => void) | undefined,
	setEdges: ((edges: Edge[]) => void) | undefined,

	//
	animationSpeed: number,
	showMinimap: boolean,
	showControls: boolean,
	fitViewEnabled: boolean,
	nodeSpacing: number,
	edgeStyle: "default" | "step" | "smoothstep",
	snapToGrid: [number, number],
	gridSize: number,
	matchSize: "2" | "4",
	numberOfTeams: number,
	numberOfInitialMatches: number,
	numberOfTotlaMatches: number,
	numberOfRounds: number,
	xpadding: number,
	ypadding: number,

}
const FlowState = $state<FlowStateType>({
	initialNodes: () => initialNodes,
	initialEdges: () => initialEdges,
	setNodes: undefined,
	setEdges: undefined,

	//
	animationSpeed: 1,
	showMinimap: true,
	showControls: true,
	fitViewEnabled: true,
	nodeSpacing: 100,
	edgeStyle: "default",
	snapToGrid: [5, 5],
	gridSize: 15,
	matchSize: "2",
	numberOfTeams: 19,
	numberOfInitialMatches: 0,
	numberOfTotlaMatches: 0,
	numberOfRounds: 0,
	xpadding: 200,
	ypadding: 0,

})

let _isFullScreen = $state<boolean>(false)
let _useSvelteFlow = $state<ReturnType<typeof useSvelteFlow>>()
const _matchSize = $derived(Number(FlowState.matchSize))
const _numberOfTeams = $derived(FlowState.numberOfTeams)

let _service_initialized = $state<boolean>(false)
let _focusedMatch = 0;
const err = () => { console.error("svelteflow services not initialized yet"); return }
const _check = () => {
	if (_useSvelteFlow == undefined) return err()
	if (_useSvelteFlow?.getNodes() == undefined) return err()
	if (_service_initialized == false) return err()
	return true
}
const FlowServices = $state({
	init: (sv: ReturnType<typeof useSvelteFlow>) => { _useSvelteFlow = sv; _service_initialized = true },
	toggleFullScreen: () => { _check() && (_isFullScreen = !_isFullScreen) },
	getNodes: () => { _check(); return _useSvelteFlow?.getNodes() || [] },

	focusMatch: (matchID: string | number) => {
		matchID = matchID.toString()
		if (!_check()) return;
		if (!FlowServices.getNodes()) return;

		if (Number(matchID) <= FlowServices.getNodes().length && Number(matchID) > 0) {
			console.log(`Focusing Match ${matchID}`)
			let node = FlowServices.getNodes().find((n) => { return n.data.matchID == matchID })
			if (!node) throw Error("no node found with this matchID ${")
			_useSvelteFlow?.fitView({ ...FocusMatchAnimation, nodes: [{ id: node.id }] })
			_focusedMatch = Number(matchID)
		}
	},
	fitWholeView: () => { _check() && _useSvelteFlow?.fitView({ ...FocusMatchAnimation, duration: 500 }) },
	isFullScreen: () => _isFullScreen,

	focusNextMatch: () => {
		FlowServices.focusMatch(_focusedMatch + 1)
	},
	focusPrevMatch: () => {
		FlowServices.focusMatch(_focusedMatch - 1)
	},
	organize: () => {
		if (!_check()) return
		let nodes = FlowServices.getNodes()
		if (nodes.length <= 0) return
		let a = nodes.length

		let w0 = (nodes[0].measured?.width || 0) + FlowState.xpadding
		let h0 = (nodes[0].measured?.height || 0) + FlowState.ypadding
		let h = h0
		let w = w0
		for (let r = 1; r <= FlowState.numberOfRounds; r++) {
			const round_nodes = nodes.filter((n) => n.data.round == r)
			h = h0

			for (let i = 0; i < round_nodes.length; i++) {
				h += h0
				_useSvelteFlow?.updateNode(round_nodes[i].id, { position: { x: w*r, y: h } })
			}
		}


	},
	// organize: () => {
	// 	if (!_check()) return
	// 	let nodes = FlowServices.getNodes()
	// 	if (nodes.length <= 0) return
	// 	let a = nodes.length
	// 	let n = 2
	// 	while (a - n >= n) {
	// 		n *= 2
	// 	}
	// 	//1 --> n --> a


	// 	let w0 = (nodes[0].measured?.width || 0) + FlowState.xpadding
	// 	let h0 = (nodes[0].measured?.height || 0) + FlowState.ypadding
	// 	let h = h0
	// 	let w = -w0
	// 	let x = 1
	// 	// _useSvelteFlow?.updateNode(nodes[0].id, { position: { x: w, y: h } })
	// 	console.log(`n=${n} w0=${w0} h0=${h0}`)

	// 	for (let i = 0; i < a-n; i++) {
	// 		h = h0 + h0 * (x % n + Math.trunc(x / n))
	// 		x += 2
	// 		_useSvelteFlow?.updateNode(nodes[i].id, { position: { x: w, y: h } })
	// 	}
	// 	// FlowServices.getNodes()
	// 	// nodes = FlowServices.getNodes()
	// 	// for (let i = 0; i < a-n; i++) {
	// 	// 	const node = nodes[i]
	// 	// 	console.log(`checking nodeid:${node.id} matchID=${node.data.matchID}` )

	// 	// 	if (node.id != node.data.matchID) {
	// 	// 		console.log("found problem ")
	// 	// 		const correct_node = nodes.find((n)=>n.data.matchID == node.id+1) 
	// 	// 		// _useSvelteFlow?.updateNode(nodes[i].id, { data: correct_node?.data })
	// 	// 	}
	// 	// }
	// 	w += w0
	// 	h = h0
	// 	console.log(`n=${n} w0=${w0} h0=${h0}`)

	// 	for (let i =  a-n; i < a; i++) {
	// 		h += h0
	// 		_useSvelteFlow?.updateNode(nodes[i].id, { position: { x: -w, y: h } })
	// 	}



	// },
	clearNodes: () => {
		_useSvelteFlow?.deleteElements({ nodes: FlowServices.getNodes(), edges: [] })
	},
	applySettings: (numberOfTeams?: number) => {
		// if (matchSize != undefined) { FlowState.matchSize = matchSize }
		// if (numberOfMatches != undefined) { FlowState.numberOfMatches = numberOfMatches }
		// if (xpadding != undefined) { FlowState.xpadding = xpadding }
		// if (ypadding != undefined) { FlowState.ypadding = ypadding }
		if (numberOfTeams != undefined) { FlowState.numberOfTeams = numberOfTeams }
		FlowServices.clearNodes()
		generateInitialNodes()
		setTimeout(() => { FlowState.setNodes && FlowState.setNodes(initialNodes) }, 0)

		setTimeout(FlowServices.organize, 100)
		setTimeout(FlowServices.fitWholeView, 150)
		console.log(FlowServices.getNodes(), initialNodes)


	},
	handleKeydown: (e: KeyboardEvent) => {
		switch (e.key) {
			case "v":
				e.preventDefault();
				FlowServices.applySettings()
				break;
			case "c":
				e.preventDefault();
				FlowServices.clearNodes()
				break;
			case "o":
				e.preventDefault();
				FlowServices.organize()
				break;
			case "f":
				e.preventDefault();
				FlowServices.toggleFullScreen()
				break;
			case 'r':
				e.preventDefault();
				FlowServices.fitWholeView()
				break;
			case "a":
				e.preventDefault();
				FlowServices.focusPrevMatch()
				break;
			case "d":
				e.preventDefault();
				FlowServices.focusNextMatch()
				break;
			case "Escape":
				break;
		}
	}

})

// Export a single instance to be shared across components
export { FlowState, FlowServices, FocusMatchAnimation }
