fetch('http://localhost:5000/api/reviews?role=owner')
    .then(r => r.json())
    .then(data => {
        const id = data.reviews[0].id;
        console.log('Got ID:', id);
        return fetch('http://localhost:5000/api/reviews/' + id + '/approve', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ownerKey: '1234' })
        });
    })
    .then(r => r.json())
    .then(data => console.log('Approved:', data));
