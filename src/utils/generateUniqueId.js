import uuid from 'react-native-uuid';

export function generateId(){
    return uuid.v4();
}
