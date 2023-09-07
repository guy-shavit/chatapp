class LoginRequests {
    #base_url;
    constructor(base_url){
        this.#base_url = base_url;
    }

    async isBearerTokenValid(bearerToken) {
        const result =  await fetch(`${this.#base_url}/auth/validateBearerToken/`, {
            method: "POST",
            mode: 'cors',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'Authorization': bearerToken
            })
        }).then(res => {
            return res.json();
        });

        return result.statusCode === 200;
    }

    async login(username, password) {
        const result =  await fetch(`${this.#base_url}/auth/login/`, {
            method: "POST",
            // mode: 'cors',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {
            return res.json();
        })
        return result;
    }
}

export default LoginRequests;