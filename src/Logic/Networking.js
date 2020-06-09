export function getData(url, updateData = null){
    fetch("https://us-central1-bakeoff-chat-app.cloudfunctions.net/app" + url, {
        mode: 'cors',
        method: 'GET',
        redirect: 'follow',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(response => response.json()).then((data) => {
        console.log('DATA FETCHED');
        if (updateData){
            updateData(data);
        }
        return data;
    }).catch((error) => {
        console.error('networking, getData ERROR');
    });
}

export function postData(url, incomingData, dataFunction = null){
    fetch("https://us-central1-bakeoff-chat-app.cloudfunctions.net/app" + url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(incomingData),
        redirect: 'follow'
    }).then((response) => response.json()).then((data) => {
        console.log('DATA POSTED');
        if (dataFunction){
            dataFunction();
        }
    }).catch((error) => {
        console.log('ERROR');
    });
}

export function putData(url, incomingData, dataFunction){
    fetch("https://us-central1-bakeoff-chat-app.cloudfunctions.net/app" + url, {
        mode: 'cors',
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(incomingData),
        redirect: 'follow'
    }).then((response) => response.json()).then((data) => {
        console.log('PUT DATA');
        if (dataFunction){
            dataFunction();
        }
    }).catch((error) => {
        console.log('ERROR');
        if (dataFunction){
            dataFunction();
        }
    });
}

export function deleteData(url, dataFunction = null){
    fetch("https://us-central1-bakeoff-chat-app.cloudfunctions.net/app" + url, {
        mode: 'cors',
        method: 'delete',
        redirect: 'follow',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(response => JSON.stringify(response)).then(response => {
        console.log('DELETED DATA');
        if (dataFunction){
            dataFunction(response);
        }
    }).catch((error) => {
        console.log('deleteData ERROR');
    });
}