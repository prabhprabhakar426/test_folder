import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
});

// Interceptor for Request
api.interceptors.request.use((config)=> 
    {
        const token = localStorage.getItem('authTokens');

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(config)
        return config;
    },
    (error) => Promise.reject(error)
);


// Interceptor for Response
api.interceptors.response.use((response) => {
    return response;
},async (error)=>{

    console.log('interceptor response',error.response)
    const originalReq = error.config;

    if(error.response?.status === 401 && !originalReq.retry){
        originalReq.retry = true

        console.log(' interceptor retry');
        try {
            console.log('inside try')
            const res = await api.post('/user/refresh');
            console.log('error data :-',res)
            // localStorage.removeItem('authTokens')
            localStorage.setItem('authTokens', res.data.accessToken);

            originalReq.headers.Authorization =
                `Bearer ${res.data.accessToken}`;

        return api(originalReq);
            
        } catch (error) {
            localStorage.removeItem('authTokens');
            return window.location.href = '/login';
        }
    }
    return Promise.reject(error);
})

