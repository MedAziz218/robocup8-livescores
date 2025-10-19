
import {
	type Node,
	type Edge,
	type FitViewOptions,
	useSvelteFlow,
	useConnection,
} from '@xyflow/svelte';

import { type TeamData } from '$lib/(components)/flow/team-component.svelte';
import { type MatchNode, type MatchNodeData } from '$lib/(components)/flow/match-node.svelte';
let initialNodes: Node[] = []
let initialEdges: Edge[] = []
type EdgeData = { round: number }
export type CustomEdge = Edge<EdgeData>;
function closestUpperPower(n: number, p: number) {
	let x = p
	while (x < n) x *= p;
	return x / p
}
function closestLowerPower(n: number, p: number) {
	let x = p
	while (x < n) x *= p;
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

	let numberOfInitialMatches = closestUpperPower(_numberOfTeams, _matchSize)

	let { numberOfTotlaMatches, numberOfRounds } = TournamentRounds(numberOfInitialMatches, _matchSize);

	FlowState.numberOfInitialMatches = numberOfInitialMatches;
	FlowState.numberOfTotlaMatches = numberOfTotlaMatches;
	FlowState.numberOfRounds = numberOfRounds;

	// add first round
	let round2PrevMatchesCount = (_numberOfTeams - numberOfInitialMatches) / numberOfInitialMatches
	console.log("ez", round2PrevMatchesCount)
	round2PrevMatchesCount = Math.ceil(round2PrevMatchesCount + 0.5)
	if (_numberOfTeams == numberOfInitialMatches * _matchSize) {
		round2PrevMatchesCount = _matchSize
	}

	console.log("ggg", round2PrevMatchesCount, _numberOfTeams, numberOfInitialMatches, numberOfTotlaMatches)
	for (let i = 1; i <= numberOfInitialMatches * round2PrevMatchesCount / _matchSize; i++) {

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
	FlowState.numberOfTeamsUsed = team_counter

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
						teamsData: Teams,
						prevMatchesCount: r == 2 ? round2PrevMatchesCount : undefined
					},
					position: { x: 0, y: 0 },
				},
			)
		}

	}
}
function relabelNodes(nodes: Node[]) {
	let team_counter = 0
	let match_counter = 0
	nodes.map((n) => {
		let data = n.data as MatchNodeData
		if (data.matchID == -1) return n
		if (data.round == 1) {
			let teamsData = data.teamsData as TeamData[]

			for (let i = 0; i < teamsData.length; i++) {
				if (teamsData[i].isBlank) {
					teamsData[i].teamID = 666


				} else {
					team_counter++
					// teamsData[i].id = team_counter.toString()
					teamsData[i].teamID = team_counter

				}
			}
		}
		match_counter++
		data.matchID = match_counter
		n.data = data

		return n
	})
	nodes.map((n) => {
		let data = n.data as MatchNodeData
		if (data.round == 2) {
			let teamsData = data.teamsData as TeamData[]
			let x = _matchSize - (data.prevMatchesCount || _matchSize)
			for (let i = 0; i < teamsData.length; i++) {
				if (teamsData[i].teamID != -1) {
					team_counter++
					teamsData[i].id = team_counter.toString()
					teamsData[i].teamID = team_counter
				}
			}
			x = x - teamsData.filter((t) => t.teamID != -1).length
			console.log("Xxxxxxxxxxxxxxxxxxxxx", x)
			if (x > 0) {
				for (let i = 0; i < x; i++) {
					const a = teamsData.findIndex((t) => t.teamID == -1)
					if (a == -1) { throw Error("problem here") }
					team_counter++
					teamsData[i].id = team_counter.toString()
					teamsData[i].teamID = team_counter
				}
			}
		}

		return n
	})
	FlowState.numberOfTeamsUsed = team_counter
	return nodes
}

function generateInitialEdges() {
	// make sure to run generateInitialNodes first
	initialEdges = []

	for (let r = 1; r <= FlowState.numberOfRounds - 1; r++) {
		const roundA = initialNodes.filter((n) => n.data.round == r)
		const roundB = initialNodes.filter((n) => n.data.round == r + 1)
		// console.log(roundB)
		let a = 0

		for (let b = 0; b < roundB.length; b++) {
			let x = _matchSize
			if (roundB[b].data.prevMatchesCount) {
				x = roundB[b].data.prevMatchesCount as number
			}
			for (let _ = 0; _ < x; _++) {
				let e: CustomEdge = {
					id: `${roundA[a].id}-${roundB[b].id}`,
					source: roundA[a].id,
					target: roundB[b].id,
					type: 'step',
					style: `stroke-width: 3px;`,
					data: { round: r }
				}
				a++
				initialEdges.push(e)

			}

		}

	}

}


// let initialEdges: Edge[] = [
// 	{ id: "e1-2", source: "1", target: "2" },
// 	{ id: "e2-3", source: "2", target: "3" },
// 	{ id: "e2-4", source: "2", target: "4" },
// 	{ id: "e3-5", source: "3", target: "5" },
// 	{ id: "e4-5", source: "4", target: "5" },
// ];


const FocusMatchAnimation = $state<FitViewOptions>({
	padding: 0.1,
	includeHiddenNodes: false,
	minZoom: 0.2,
	maxZoom: 2.25,
	duration: 1000
});

type FlowStateType = {

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
	numberOfTeamsUsed: number,
	numberOfInitialMatches: number,
	numberOfTotlaMatches: number,
	numberOfRounds: number,
	xpadding: number,
	ypadding: number,
	startRound: number,
	sidePanelTabValue: "builder" | "presenting"
	MatchNodewidth: number,
	teamNames: string,
}
let defaultFlowState: FlowStateType = {

	animationSpeed: 1,
	showMinimap: true,
	showControls: true,
	fitViewEnabled: true,
	nodeSpacing: 100,
	edgeStyle: "default",
	snapToGrid: [10, 10],
	gridSize: 15,
	matchSize: "2",
	numberOfTeams: 19,
	numberOfTeamsUsed: 20,
	numberOfInitialMatches: 0,
	numberOfTotlaMatches: 0,
	numberOfRounds: 0,
	xpadding: 200,
	ypadding: 0,
	startRound: 1,
	sidePanelTabValue: "presenting",
	MatchNodewidth: 320,
	teamNames: '',
}

const loadedFlowState = JSON.parse(localStorage.getItem("FlowState") || '{}');
const FlowState = $state<FlowStateType>(loadedFlowState.fitViewEnabled ? loadedFlowState : defaultFlowState)


let _isFullScreen = $state<boolean>(false)
let _useSvelteFlow = $state<ReturnType<typeof useSvelteFlow>>()
let _useConnection = $state<ReturnType<typeof useConnection>>()

const _matchSize = $derived(Number(FlowState.matchSize))
const _numberOfTeams = $derived(FlowState.numberOfTeams)

let _service_initialized = $state<boolean>(false)
let _focusedMatch = 0;
const err = () => { console.error("svelteflow services not initialized yet"); return }
const _check = () => {
	if (_useSvelteFlow == undefined) return err()
	if (_useSvelteFlow?.getNodes() == undefined) return err()
	if (_useSvelteFlow?.getEdges() == undefined) return err()
	if (_service_initialized == false) return err()
	return true
}
const FlowServices = $state({
	init: (sv: ReturnType<typeof useSvelteFlow>, c: ReturnType<typeof useConnection>) => { _useSvelteFlow = sv; _useConnection = c; _service_initialized = true },
	toggleFullScreen: () => { _check() && (_isFullScreen = !_isFullScreen) },
	getNodes: () => { _check(); return _useSvelteFlow?.getNodes() || [] },
	getEdges: () => { _check(); return _useSvelteFlow?.getEdges() || [] },
	setNodes: (nodes: Node[]) => { },
	setEdges: (edges: Edge[]) => { },
	saveToJson: () => {
		let s = { FlowState: FlowState, nodes: FlowServices.getNodes(), edges: FlowServices.getEdges() }
		console.log("saving ", s)
		downloadStringAsFile('flow.json', JSON.stringify(s))
	},
	LoadFromJson: (e: Event) => {
		handleFileChange(e).then((str) => {
			if (!str) throw Error("nope")
			console.log("JSON as string:", );
			let jsonobj = JSON.parse(str)
			// @ts-ignore
			// $state.apply(jsonobj.FlowState)
			FlowServices.setNodes && FlowServices.setNodes(jsonobj.nodes)
			FlowServices.setEdges && FlowServices.setEdges(jsonobj.edges)
			console.log(jsonobj.nodes)
			copyFlowState(jsonobj.FlowState)
			// jsonobj.nodes.map((n) => { _useSvelteFlow?.updateNodeData(n.id, n.data) })

		});

		// downloadStringAsFile('flow.json',JSON.stringify(s))

	},
	applyTeamNames: () => {
		let nodes = FlowServices.getNodes()
		let tl = FlowState.teamNames.split('\n')
		let i = 0
		let j = 0
		console.log("applying names")
		if (FlowState.numberOfTeamsUsed >= tl.length) throw Error("list of names is too short")
		while (i < FlowState.numberOfTeamsUsed && j < nodes.length) {
			let teamsData = nodes[j].data.teamsData as TeamData[]
			teamsData.map((t) => {
				if (t.teamID != -1 && !t.isBlank) {
					t.teamName = tl[i]
					i++;
					console.log(t.teamID, t.teamName)
				}

			})
			_useSvelteFlow?.updateNodeData(nodes[j].id, { teamsData: teamsData })
			j++
		}

	},
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
	organize: async () => {
		if (!_check()) return
		let nodes = FlowServices.getNodes()
		let edges = FlowServices.getEdges()
		if (nodes.length <= 0) return
		let a = nodes.length

		nodes = nodes.map((n) => {
			if (n.data.round as number < FlowState.startRound) {
				n.hidden = true
			} else if (n.data.matchID != -1) {
				n.hidden = false
			}
			return n
		})
		edges = edges.map((e) => {
			if (e.data?.round as number < FlowState.startRound) {
				e.hidden = true
			} else if (!e.id.endsWith('-hidden')) {
				e.hidden = false
			}
			return e
		})
		let w0 = (nodes[0].measured?.width || 0) + FlowState.xpadding
		let h0 = (nodes[0].measured?.height || 0) + FlowState.ypadding
		let h = h0
		let w = w0
		// do first round 
		const round_nodes = nodes.filter((n) => n.data.round == FlowState.startRound)
		for (let i = 0; i < round_nodes.length; i++) {
			h += h0
			// _useSvelteFlow?.updateNode(round_nodes[i].id, { position: { x: w , y: h } })
			nodes = nodes.map((n) => {
				if (n.id == round_nodes[i].id) {
					n.position = { x: w * FlowState.startRound, y: h }
				}
				return n
			})
		}
		for (let r = FlowState.startRound + 1; r <= FlowState.numberOfRounds; r++) {
			const round_nodes = nodes.filter((n) => n.data.round == r)

			for (let i = 0; i < round_nodes.length; i++) {
				const node = round_nodes[i]
				const connected_nodes_ids = edges.filter((e) => e.target == node.id).map((e) => e.source)
				const connected_nodes_y = nodes.filter((n) => connected_nodes_ids.includes(n.id)).map((n) => n.position.y)
				const y = (Math.max(...connected_nodes_y) + Math.min(...connected_nodes_y)) / 2
				// h += h0
				// _useSvelteFlow?.updateNode(round_nodes[i].id, { position: { x: w * r, y: y } })
				nodes = nodes.map((n) => {
					if (n.id == round_nodes[i].id) {
						n.position = { x: w * r, y: y }
					}
					if (connected_nodes_ids.includes(n.id)) {
						n.data.winnerNextMatchID = round_nodes[i].id
					}
					return n
				})
			}

		}
		nodes = relabelNodes(nodes)
		FlowServices.setNodes && FlowServices.setNodes(nodes);
		nodes.map((n) => { _useSvelteFlow?.updateNodeData(n.id, n.data) })



	},



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
		generateInitialEdges()
		setTimeout(() => {
			FlowServices.setNodes && FlowServices.setNodes(initialNodes);
			FlowServices.setEdges && FlowServices.setEdges(initialEdges);
		}, 0)


		setTimeout(FlowServices.organize, 100)

		setTimeout(FlowServices.fitWholeView, 200)
		console.log(FlowServices.getNodes(), initialNodes)
		// console.log(FlowServices.getEdges(), initialEdges)



	},
	handleKeydown: (e: KeyboardEvent) => {
		switch (e.key) {
			// case "v":
			// 	e.preventDefault();
			// 	FlowServices.applySettings()
			// 	break;
			// case "c":
			// 	e.preventDefault();
			// 	FlowServices.clearNodes()
			// 	break;
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
	},

	addTeamToMatch: (targetMatchID: string, winnerteamData: TeamData, oldWinnerTeamID?: number, sourceNodeID?: string) => {
		// FlowServices.applySettings()
		// console.log(FlowServices.getNodes())
		const n = FlowServices.getNodes().find((n) => n.id == targetMatchID)
		if (!n) { console.log("cant find id "); return }

		let old_teams_data = n.data.teamsData as TeamData[]
		let i = -1;
		if (oldWinnerTeamID) {
			i = old_teams_data.findIndex((t) => t.teamID == oldWinnerTeamID)
			old_teams_data[i] = { ...winnerteamData, teamStatus: undefined }

		}
		else {

			i = old_teams_data.findIndex((t) => t.teamID == winnerteamData.teamID)

			if (i < 0) {

				i = old_teams_data.findIndex((t) => t.teamID == -1)
				old_teams_data[i] = { ...winnerteamData, teamStatus: undefined, id: old_teams_data[i].id }
			}
		}

		_useSvelteFlow?.updateNodeData(n.id, { teamsData: old_teams_data })


		if (sourceNodeID) {
			const e = FlowServices.getEdges().find((e) => e.source == sourceNodeID)
			if (e)
				_useSvelteFlow?.updateEdge(e.id, { ...e, style: `stroke-width: 3px; stroke: green` })
		}
	}
	,
	removeTeamFromMatch: (targetMatchID: string, winnerteamData: TeamData, sourceNodeID?: string) => {
		// FlowServices.applySettings()
		// console.log(FlowServices.getNodes())
		const n = FlowServices.getNodes().find((n) => n.id == targetMatchID)
		if (!n) { console.log("cant find id "); return }

		let old_teams_data = n.data.teamsData as TeamData[]


		let i = old_teams_data.findIndex((t) => t.teamID == winnerteamData.teamID)
		console.log("here is i ", i, n.id)
		old_teams_data[i] = { ...winnerteamData, teamStatus: undefined, teamID: -1, teamName: '-', id: old_teams_data[i].id }

		_useSvelteFlow?.updateNodeData(n.id, { teamsData: old_teams_data })
		if (sourceNodeID) {
			const e = FlowServices.getEdges().find((e) => e.source == sourceNodeID)
			if (e)
				_useSvelteFlow?.updateEdge(e.id, { ...e, style: `stroke-width: 3px;` })
		}
	}

})

const MatchServices = $state({

}
)
// Export a single instance to be shared across components
export { FlowState, FlowServices, FocusMatchAnimation, MatchServices }


function downloadStringAsFile(filename: string, content: string) {
	// Create a Blob with the content
	const blob = new Blob([content], { type: 'text/plain' });

	// Create a temporary anchor element
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = filename;

	// Append to body, click it, and remove it
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	// Release the object URL
	URL.revokeObjectURL(a.href);
}



function handleFileChange(event: Event): Promise<string | null> {
	return new Promise((resolve) => {
		const input = event.target as HTMLInputElement;
		let error, jsonString;

		if (!input.files || input.files.length === 0) {
			resolve(null);
			return;
		}

		const file: File = input.files[0];

		if (!file.name.endsWith(".json")) {
			error = "Please select a JSON file";
			jsonString = null;
			resolve(null);
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			try {
				const content = reader.result as string;
				jsonString = content;
				error = null;
				resolve(content); // return JSON string
			} catch {
				error = "Invalid JSON file";
				jsonString = null;
				resolve(null);
			}
		};

		reader.readAsText(file);
	});
}
function copyFlowState(a: FlowStateType) {
	FlowState.animationSpeed = a.animationSpeed;
	FlowState.showMinimap = a.showMinimap;
	FlowState.showControls = a.showControls;
	FlowState.fitViewEnabled = a.fitViewEnabled;
	FlowState.nodeSpacing = a.nodeSpacing;
	FlowState.edgeStyle = a.edgeStyle;
	FlowState.snapToGrid = [a.snapToGrid[0], a.snapToGrid[1]]; // copy tuple explicitly
	FlowState.gridSize = a.gridSize;
	FlowState.matchSize = a.matchSize;
	FlowState.numberOfTeams = a.numberOfTeams;
	FlowState.numberOfTeamsUsed = a.numberOfTeamsUsed;
	FlowState.numberOfInitialMatches = a.numberOfInitialMatches;
	FlowState.numberOfTotlaMatches = a.numberOfTotlaMatches;
	FlowState.numberOfRounds = a.numberOfRounds;
	FlowState.xpadding = a.xpadding;
	FlowState.ypadding = a.ypadding;
	FlowState.startRound = a.startRound;
	FlowState.sidePanelTabValue = a.sidePanelTabValue;
	FlowState.MatchNodewidth = a.MatchNodewidth;
	FlowState.teamNames = a.teamNames;
}