const fs = require('fs');
fetch('http://localhost:5000/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', role: 'Tester', content: 'Good', rating: 5 })
}).then(r => r.json()).then(d => console.log('POST', d));
