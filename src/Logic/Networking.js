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
        console.log('networking, getData: ' + JSON.stringify(data));
        if (updateData){
            updateData(data);
        }
        return data;
    }).catch((error) => {
        console.error('networking, getData error is: ' + error.message + ' ' + error.toString());
    });
}

export function postData(url, incomingData, dataFunction = null, array){
    fetch("https://us-central1-bakeoff-chat-app.cloudfunctions.net/app" + url, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(incomingData),
        redirect: 'follow'
    }).then((response) => response.json()).then((data) =>{
        console.log('new post: ' + JSON.stringify(data));
        dataFunction(data, array);
    }).catch((error) => {
        console.log('error: ' + error.message + ' ' + error.toString());
    });
}

export function deleteData(url, dataFunction = null, value = null){
    fetch("https://us-central1-bakeoff-chat-app.cloudfunctions.net/app" + url, {
        mode: 'cors',
        method: 'delete',
        redirect: 'follow',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(response => JSON.stringify(response)).then(response => {
        console.log('deleteData response: ' + response);
        dataFunction(value);
    }).catch((error) => {
        console.log('deleteData error: ' + error.message + ' ' + error.toString());
    });
}