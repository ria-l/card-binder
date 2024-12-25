let data = [
    ['id', 'name', 'value'],
    [234, 'alakazam', 45],
    [123, 'pikachu', 25],
];
let [header, ...rows] = data;
// Use reduce to build the result object
let result = rows.reduce((acc, row) => {
    debugger;
    // Create an object by mapping each row value to its corresponding header field name
    let card = header.reduce((obj, key, index) => {
        debugger;
        obj[key] = row[index];
        return obj;
    }, {});
    // Use the first field (assumed to be 'id') as the key for the object
    acc[card.id] = card;
    return acc;
}, {});
console.log(result);
export {};
//# sourceMappingURL=dev.js.map