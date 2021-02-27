setInterval(()=>{
    let birth = new Date(2002, 2, 1);
    let now =  Date.now();
    age.innerHTML = ((now - birth) / (1000 * 60 * 60 * 24 * 365.2425)).toFixed(10);
}, 50);

