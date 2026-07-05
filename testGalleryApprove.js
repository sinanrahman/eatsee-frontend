fetch('http://localhost:5000/api/gallery?type=All&role=owner')
    .then(r => r.json())
    .then(data => {
        const pending = data.items.find(i => !i.approved);
        if(!pending) return console.log('no pending items');
        const id = pending.id;
        console.log('Got ID:', id);
        return fetch('http://localhost:5000/api/gallery/' + id + '/approve', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ownerKey: '1234' })
        });
    })
    .then(r => r?.json && r.json())
    .then(data => console.log('Approved:', data))
    .catch(console.error);
