import * as constants from './constants.js';
import * as get from './get.js';
import * as pull from './pull-fn.js';
import * as sm from './sort-mapping.js';
import * as store from './store.js';
import * as tcg from './api-tcg.js';
import * as types from './types.js';
import * as ui from './ui.js';
import * as utils from './utils.js';
export function sortSetsByReleaseDate(data) {
    return data.sort((a, b) => new Date(a.releaseDate).valueOf() - new Date(b.releaseDate).valueOf());
}
export const sortBySetNum = (data) => {
    return data.sort((a, b) => {
        const numA = extractNumber(a.zRaw.number);
        const numB = extractNumber(b.zRaw.number);
        return numA - numB;
    });
};
export const sortByReleaseDate = (data) => {
    return data.sort((a, b) => {
        const dateA = new Date(a.zRaw.set.releaseDate);
        const dateB = new Date(b.zRaw.set.releaseDate);
        // Ensure valid dates before comparing
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0; // If either date is invalid, leave the order unchanged
        }
        return dateA.getTime() - dateB.getTime();
    });
};
export function sortByDex(data) {
    return data.sort((a, b) => {
        const numA = a.nationalDex ?? 2000;
        const numB = b.nationalDex ?? 2000;
        return numA - numB;
    });
}
export const sortByEnergy = (data) => {
    return data.sort((a, b) => {
        const numA = sm.energy[a.energy.toLowerCase()] ?? 2000;
        const numB = sm.energy[b.energy.toLowerCase()] ?? 2000;
        return numA - numB;
    });
};
export const sortByRarity = (data) => {
    return data.sort((a, b) => {
        const numA = sm.rarity[a.zRaw.rarity?.toLowerCase()] ?? 2000;
        const numB = sm.rarity[b.zRaw.rarity?.toLowerCase()] ?? 2000;
        return numA - numB;
    });
};
export const sortBySubtype = (data) => {
    return data.sort((a, b) => {
        const numA = sm.subtype[a.subtype.toLowerCase()] ?? 2000;
        const numB = sm.subtype[b.subtype.toLowerCase()] ?? 2000;
        return numA - numB;
    });
};
export const sortBySupertype = (data) => {
    return data.sort((a, b) => {
        const numA = sm.supertype[a.supertype.toLowerCase()] ?? 2000;
        const numB = sm.supertype[b.supertype.toLowerCase()] ?? 2000;
        return numA - numB;
    });
};
function extractNumber(str) {
    const match = str.match(/(\d+)/); // Extracts the first sequence of digits
    return match ? parseInt(match[0], 10) : 0; // Default to 0 if no number is found
}
/**
 * sorts and redisplays current cards based on selected sort value
 */
export async function sortCards() {
    const cards = await get.getCardsForActiveSet();
    const sortBy = utils.getElByIdOrThrow('sort-dropdown')
        .value;
    if (sortBy == 'Dex #') {
        let sorted = sortBySetNum(cards.cards);
        sorted = sortByReleaseDate(sorted);
        sorted = sortBySubtype(sorted);
        sorted = sortByRarity(sorted);
        sorted = sortByDex(sorted);
        return sortBySupertype(sorted);
    }
    else if (sortBy == 'Energy Type') {
        let sorted = sortBySetNum(cards.cards);
        sorted = sortByReleaseDate(sorted);
        sorted = sortByRarity(sorted);
        sorted = sortByDex(sorted);
        sorted = sortByEnergy(sorted);
        return sortBySupertype(sorted);
    }
    else if (sortBy == 'Card Type') {
        let sorted = sortBySetNum(cards.cards);
        sorted = sortByReleaseDate(sorted);
        sorted = sortByDex(sorted);
        sorted = sortByEnergy(sorted);
        sorted = sortBySubtype(sorted);
        return sortBySupertype(sorted);
    }
    else if (sortBy == 'Set Number') {
        let sorted = sortBySetNum(cards.cards);
        return sortBySupertype(sorted);
    }
    else if (sortBy == 'Rarity') {
        let sorted = sortBySetNum(cards.cards);
        sorted = sortByReleaseDate(sorted);
        sorted = sortByDex(sorted);
        sorted = sortByEnergy(sorted);
        sorted = sortByRarity(sorted);
        return sortBySupertype(sorted);
    }
    else if (sortBy == 'recent') {
    }
}
//# sourceMappingURL=sort.js.map