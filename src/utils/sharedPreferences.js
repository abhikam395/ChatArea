import SharedPreferenes from 'react-native-shared-preferences';

const USER = 'USER';

export function getUser(){
    return new Promise((resolve, reject) => {
        SharedPreferenes.getItem(USER, function(value) {
            resolve(value);
        })
    })
}

export function setUser(user){
    SharedPreferenes.setItem(USER, JSON.stringify(user));
}