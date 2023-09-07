class ChatsRequests {
    #base_url;
    constructor(base_url){
        this.#base_url = base_url;
        this.bearerToken = null;
    }

    setBearerToken(bearerToken) {
        this.bearerToken = bearerToken;
    }
    
     setChatsOnLoad(setChatsList) {
        fetch(`${this.#base_url}/chats/getChatsOnSiteLoad`, {
            method: "GET",
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${this.bearerToken}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(data => {
            setChatsList(data);
        });
    }

    setChatsSearch(partialChatName, setChatsList) {
        fetch(`${this.#base_url}/chats/getSearchChats?chatQuery=${partialChatName}`, {
            method: "GET",
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${this.bearerToken}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(data => {
            setChatsList(data);
        });
    }

    async startDMConversation(body) {
        const result = await fetch(`${this.#base_url}/chats/startDM`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.bearerToken}`
            },
            body: JSON.stringify(body)
        });

        return result.json();
    }

    async storeMessage(body, setMessages) {
        const result = await fetch(`${this.#base_url}/chats/storeMessage`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.bearerToken}`
            },
            body: JSON.stringify(body)
        });

        let msg = await result.json();

        setMessages(prev => [...prev, msg]);
        return msg;
    }

    async setChatMessagesOnSelect(conversationId, setMessages) {
        fetch(`${this.#base_url}/chats/getChatMessages?conversationId=${conversationId}`, {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.bearerToken}`
            },
        }).then(res => {
            return res.json();
        }).then(data => {
            setMessages(data);
        });
    }

    setNewUsersBySearch(partialUsername, setChatsList) {
        fetch(`${this.#base_url}/chats/getNewUsersBySearch?username=${partialUsername}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.bearerToken}`
            }
        }).then(res => {
            return res.json();
        }).then(data => {
            setChatsList(data);
        })
        
    }

    async getMyDMUsers() {
        const result = await fetch(`${this.#base_url}/chats/getMyDMUsers`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.bearerToken}`
            }
        })
        return await result.json();
    }

    async createGroup(body) {
        const group = await fetch(`${this.#base_url}/chats/createGroup`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.bearerToken}`
            },
            body: JSON.stringify(body)
        })

        return await group.json();
    }

    async setGroupImage(groupId, image) {
        const formdata = new FormData();
        formdata.append("picture", image);

        fetch(`${this.#base_url}/chats/uploadGroupProfileImage?groupId=${groupId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.bearerToken}`
            },
            body: formdata
        })
    }

    async getGroup(groupId) {
        const result = await fetch(`${this.#base_url}/chats/getGroup?id=${groupId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.bearerToken}`
            }
        });

        return await result.json();
    }

    async getConversationMembers(groupId) {
        const result = await fetch(`${this.#base_url}/chats/getConversationMembers?id=${groupId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${this.bearerToken}`
            }
        })

        return await result.json();
    }

}

export default ChatsRequests;