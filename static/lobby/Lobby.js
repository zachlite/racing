import React from "react";
import ReactDOM from "react-dom";
import IO from "socket.io-client";

class Lobby {
	constructor(socket, playerNumber) {
		var lobby = document.createElement('div');
		lobby.setAttribute("id", "lobby");
		document.getElementById("party").appendChild(lobby);
		var lobbyView = React.createElement(LobbyView, 
			{
				"socket": socket, 
				"playerNumber": playerNumber
			}
		);
		ReactDOM.render(lobbyView, document.getElementById('lobby'));
	}

	stop() {
		var lobby = document.getElementById("lobby");
		lobby.parentNode.removeChild(lobby);
	}

	getPlayerData() {
		
	}
}


class LobbyView extends React.Component {
	constructor(props) {
		super();
		this.socket = props.socket;
		this.playerMax = 4;
		this.state = {
			playersMissing: this.playerMax,
			players: []
		};
		this.listen();
		this.socket.emit("PLAYER_IN_LOBBY");
	};

	listen() {
		this.socket.on("PLAYER_JOINED_LOBBY", (players) => {
			console.log("player joined lobby!");
			this.updatePlayers(players);
		});

		this.socket.on("PLAYER_LEFT", (players) => {
			console.log("player left lobby");
			this.updatePlayers(players);
		});	
	};

	updatePlayers(players) {
		this.setState({
			players: players,
			playersMissing: this.playerMax - players.length
		});
	};

	render() {
		return (
			<div>
				<h1>Party Lobby</h1>
				<h3 id="lobby-message">Waiting for {this.state.playersMissing} more player(s)...</h3>
				<PlayerList players={this.state.players}/>
			</div>
		);	
	};
}

class PlayerList extends React.Component {
	render() {
		return (
			<ul id="player-list">
				{this.props.players.map((playerName, index) => (
					<li className={"player player-" + (index + 1)} key={index}>player {index + 1}: {playerName}</li>
				))}
			</ul>
		);
	}
}

export default Lobby;
