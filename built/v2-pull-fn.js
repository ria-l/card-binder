import * as get from './v2-get.js';
export async function openPack() {
    var { setId, cards } = await get.getCardsForSet();
    console.log(setId, cards);
    const pulled = [];
    for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * cards.length);
        if (!cards[index]) {
            throw new Error(`no index ${index} in cards ${cards}`);
        }
        pulled.push(cards[index]);
    }
    console.log('pulled', pulled);
}
//# sourceMappingURL=v2-pull-fn.js.map