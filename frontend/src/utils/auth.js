import {jwtDecode}  from "jwt-decode";

export function getUser(){
    const token = localStorage.getItem('authTokens');
    console.log('getUser' + token)
    if(!token)return null;
    return jwtDecode(token);
}

export function getRole(){
    const user = getUser();
    // console.log('getRole' + user.role)
    return user? user.role : null;
}

export function getUserId(){
    const user = getUser();
    // console.log('getUserIs' + user.id)
    return user? user.id : null;
}

export function getUserName(){
    const user = getUser();
    // console.log('getUserIs ' + user.name);
    return user? user.name : null;
}

