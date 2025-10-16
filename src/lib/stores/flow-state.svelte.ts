
import {
	type Node,
	type Edge,
	type FitViewOptions,
	useSvelteFlow,
} from '@xyflow/svelte';

import { type TeamData } from '$lib/(components)/flow/team-component.svelte';
type FlowStateType = {
	nodes: () => Node[],
	edges: () => Edge[],
	refreshNodes: () => void,
	//
	animationSpeed: number,
	showMinimap: boolean,
	showControls: boolean,
	fitViewEnabled: boolean,
	nodeSpacing: number,
	edgeStyle: "default" | "step" | "smoothstep",
	snapToGrid: [number, number],
	gridSize: number,


}
let nodes: Node[] = $state.raw([]);
let teamID = 0;
for (let i = 1; i < 10; i++) {

	let Teams: TeamData[] = []

	for (let j = 1; j <= 4; j++) {
		teamID++;
		Teams.push({ teamName: `team${i}${j}`, teamID: teamID })
	}
	nodes.push(
		{
			id: i.toString(),
			type: "match",
			data: {
				matchID: i,
				matchSize: 4,

				teamsData: Teams
			},
			position: { x: 250, y: 50 },
		},
	)
}


let edges: Edge[] = $state.raw([
	{ id: "e1-2", source: "1", target: "2", animated: true },
	{ id: "e2-3", source: "2", target: "3" },
	{ id: "e2-4", source: "2", target: "4" },
	{ id: "e3-5", source: "3", target: "5" },
	{ id: "e4-5", source: "4", target: "5" },
]);



const FocusNodeAnimation = $state<FitViewOptions>({
	padding: 0.1,
	includeHiddenNodes: false,
	minZoom: 0.2,
	maxZoom: 2.25,
	duration: 1000
});


const FlowState = $state<FlowStateType>({
	nodes: () => nodes,
	edges: () => edges,
	animationSpeed: 1,
	showMinimap: true,
	showControls: true,
	fitViewEnabled: true,
	nodeSpacing: 100,
	edgeStyle: "default",
	snapToGrid: [25, 25],
	gridSize: 15,
	refreshNodes: () => { nodes = [...nodes] }
})

let _isFullScreen = $state<boolean>(false)
let _useSvelteFlow = $state<ReturnType<typeof useSvelteFlow>>()
let _service_initialized = $state<boolean>(false)
let _focusedNode = 0;
const _check = () => {
	if (_service_initialized == false || _useSvelteFlow == undefined) {
		console.error("svelteflow services not initialized yet")
		return false
	}
	return true
}
const FlowServices = $state({
	init: (sv: ReturnType<typeof useSvelteFlow>) => { _useSvelteFlow = sv; _service_initialized = true },
	toggleFullScreen: () => { _check() && (_isFullScreen = !_isFullScreen) },
	focusNode: (nodeID: string | number) => {
		nodeID = nodeID.toString()
		if (!_check()) return;
		if (Number(nodeID) < nodes.length && Number(nodeID) > 0) {
			console.log(`Focusing Node ${nodeID}`)
			_useSvelteFlow?.fitView({ ...FocusNodeAnimation, nodes: [{ id: nodeID }] })
			_focusedNode = Number(nodeID)
		}
	},
	fitWholeView: () => { _check() && _useSvelteFlow?.fitView({ ...FocusNodeAnimation, duration: 500 }) },
	isFullScreen: () => _isFullScreen,

	focusNextNode: () => {
		FlowServices.focusNode(_focusedNode + 1)
	},
	focusPrevNode: () => {
		FlowServices.focusNode(_focusedNode - 1)
	},
	handleKeydown: (e: KeyboardEvent) => {
		switch (e.key) {
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
				FlowServices.focusPrevNode()
				break;
			case "d":
				e.preventDefault();
				FlowServices.focusNextNode()
				break;
			case "Escape":
				break;
		}
	}

})

// Export a single instance to be shared across components
export { FlowState, FlowServices, FocusNodeAnimation }
