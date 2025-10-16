
import {
	type Node,
	type Edge
} from '@xyflow/svelte';
type FlowStateType = {
	nodes: () => Node[],
	edges: () => Edge[],
	refreshNodes : ()=>void,
	//
	focusedNode:number,
	animationSpeed: number,
	showMinimap: boolean,
	showControls: boolean,
	fitViewEnabled: boolean,
	nodeSpacing: number,
	edgeStyle: "default" | "step" | "smoothstep",
	snapToGrid: [number, number],
	gridSize: number,


}

let nodes: Node[] = $state.raw(
	[
		{
			id: "1",
			type: "match",
			data: {
				matchID: 1,
				matchSize: 4,

				teamsData: [{
					teamName: "hello",
					teamID: "1",
					// teamStatus: "winner"

				},
				{
					teamName: "hihi",
					teamID: "2",
					// teamStatus: "loser"


				},
				{
					teamName: "name",
					teamID: "4",


				},{
					teamName: "name",
					teamID: "3",
					teamStatus: "eliminated"


				}
				]
			},
			position: { x: 250, y: 50 },
		},
	]);

let edges: Edge[] = $state.raw([
	{ id: "e1-2", source: "1", target: "2", animated: true },
	{ id: "e2-3", source: "2", target: "3" },
	{ id: "e2-4", source: "2", target: "4" },
	{ id: "e3-5", source: "3", target: "5" },
	{ id: "e4-5", source: "4", target: "5" },
]);

const FlowState = $state<FlowStateType>({
	nodes: () => nodes,
	edges: () => edges,
	focusedNode: 0,
	animationSpeed: 1,
	showMinimap: true,
	showControls: true,
	fitViewEnabled: true,
	nodeSpacing: 100,
	edgeStyle: "default",
	snapToGrid: [25, 25],
	gridSize: 15,
	refreshNodes:()=>{nodes=[...nodes]}
})

// Export a single instance to be shared across components
export { FlowState }
