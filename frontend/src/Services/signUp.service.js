class SignUpRequests {
    #base_url;
    constructor(base_url){
        this.#base_url = base_url;
    }

    async signUp(username, password) {
        const result =  await fetch(`${this.#base_url}/auth/signUp/`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
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

export default SignUpRequests;