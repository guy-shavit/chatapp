class UserRequests {
    #base_url;

    constructor(base_url){
        this.#base_url = base_url;
        this.bearerToken = null;
    }

    setBearerToken(bearerToken) {
        this.bearerToken = bearerToken;
    }

    async initializeImageProfile(setImageProfile) {
        fetch(`${this.#base_url}/users/getProfileImage`, {
            method: "GET",
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${this.bearerToken}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(data => {
            setImageProfile(`${this.#base_url}/${data.image}`);
        });
    }

    async updateProfileImage(image) {
        const formdata = new FormData();
        formdata.append("picture", image);

        fetch(`${this.#base_url}/users/uploadProfileImage`, {
            method: "POST",
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${this.bearerToken}`,
            },
            body: formdata
        })
    }

    async getMe() {
        const user = await fetch(`${this.#base_url}/users/getMe`, {
            method: "GET",
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${this.bearerToken}`,
                'Content-Type': 'application/json'
            }
        })
        
        return user.json();
    }

    
}

export default UserRequests;