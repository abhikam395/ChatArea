import firestore from '@react-native-firebase/firestore';

const chatCollection = firestore().collection('chats');
const groupCollection =  firestore().collection('groups');

export function getGroupId(){
    return new Promise((resolve, reject) => {
        const group = groupCollection.where('members', '==', {[this.user.id] : true, [this.self.id]: true}).limit(1).get();
        if(this.group.docs.length != 0){
            let groupId = this.group.docs[0].id;
        }
        else {
            await this.createGroup(this.self.id, this.user.id);
        }
    })
}

async function createGroup(creatorId, userId){
    let groupId = null;
    try {
        const batch = firestore().batch();
        const group = await groupCollection.add({
            members: {
                [creatorId]: true,
                [userId]: true
            }
        })

        let data = await userCollection.doc(creatorId).get();
        let groups = data.data().groups;
        await userCollection.doc(creatorId).update({
            groups: Object.assign({...groups}, {[this.groupId]: true})
        })

        data = await userCollection.doc(userId).get();
        groups = data.data().groups;
        await userCollection.doc(userId).update({
            groups: Object.assign({...groups}, {[this.groupId]: true})
        })

        return group;

    } catch (error) {
        console.log(error)
    }
}