import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import RootRef from '@material-ui/core/RootRef';

import './Chat.css';

class Chat extends Component {
	constructor() {
		super();
		this.textBox = React.createRef();
		this.msgBox = React.createRef();
		this.boxShouldScroll = true;
	}
	state = {
		messages: [],
	}

	scrollDownTextBox = () => {
		if(this.boxShouldScroll) {
			this.msgBox.current.scrollTop = this.msgBox.current.scrollHeight;
		}
	}

	sendText = e => {
		e.preventDefault();
		const msg = { sender: 'Some1', content: this.textBox.current.value }
		this.addMsg(msg);
		this.socket.emit("send_msg", msg);
		this.textBox.current.value = "";
		this.boxShouldScroll = this.msgBox.current.scrollTop + this.msgBox.current.clientHeight >= this.msgBox.current.scrollHeight;
	}

	addMsg = msg => {
		let auxMsg = this.state.messages;
		auxMsg.push(msg);
		this.setState({ messages: auxMsg });
	}

	addMsgs = msgs => {
		this.setState({ messages: msgs });
	}

	componentDidUpdate() {
		this.scrollDownTextBox();
	}
	componentDidMount() {
		this.scrollDownTextBox();
		this.socket = this.props.socket;
		this.socket.on("update_msgs", this.addMsgs);
		this.socket.on("new_msg", this.addMsg);
	}
	
	render() {
		
		return (
			<Grid container direction="column" style={{ padding: 10, height: '100%' }}>
				<Grid className="title-box" container justify="center" alignItems="center" style={{ height: 30 }}>
					Chat
				</Grid>
				<RootRef rootRef={this.msgBox}>
					<Grid item xs className="content-body" style={{ overflow: 'auto' }} > 
						<Grid className="msg-box" container direction="column" justify="flex-end" alignItems="flex-end" wrap="nowrap" style={{ minHeight: '100%' }}>
							{ this.state.messages.map((message, index) => (
								<Grid key={index} className="text-box" container direction="column" justify="flex-end" style={{ maxWidth: 'max-content', marginTop: 5 }}>
									<span style={{ textAlign: 'right', fontWeight: 'bold' }}>{message.sender} says:</span>
									<span style={{ textAlign: 'right', wordWrap: 'break-word',}}>
										{message.content}
									</span>
								</Grid>
							))}
						</Grid>
					</Grid>
				</RootRef>
				<form onSubmit={this.sendText}>
					<Grid className="input-box" container direction="row" style={{ height: 50, padding: 5 }}>
							<input ref={this.textBox} type="text" placeholder="Digite uma mensagem" style={{ flexGrow: 1 }}/>
							<button type="submit">Enviar</button>
					</Grid>
				</form>
			</Grid>
		);
	}
}

export default Chat;