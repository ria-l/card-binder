# Rewarder

Reward/punishment system that uses pokemon and RNG to incentivize real-world discipline.

# walkthrough/design

1. user picks some task or goal that will allow for rolls. this part is mental.
2. user achieves goal, opens app
3. app visualizes if any pokemon have been taken away, and the current pokedex.
4. there are buttons for a dice roll or a pokemon roll. there is also an option to line up x number of "next" pokemon.
5. there is a "take away" button that will remove pokemon in dex order and store them somewhere else.
6. user picks a number for the

## fresh install

1. favorite pokemon
2. dice number

## achieved a goal with no pokenaps present and no "next" pokemon

1. user clicks "new pokemon!" button
2. images of pokemon cycle and flicker rapidly at first, then slow down until it stops on one. takes ~2 seconds.
3. the pokemon is added to the dex
4. scroll down to the inserted spot
   1. if the pokemon has been caught before:
      1. if the pokemon has a forme, immediately grant that forme and mark a duplicate in the dex.
      2. if it does not, or all formes have been collected, mark a duplicate in the dex, and add a point to the forme counter
   2. if the pokemon is new:
      1. add the pokemon to the pokedex.
5. check if the pokemon is a legendary, bae, or starter
   1. if yes, repeat collection process
6. end.

## failed a task or goal

1. user enters # of pokemon and clicks "take em away" (if no number, default to 1)
2. the first x number of pokemon in numerical order are removed and replaced with a "substitute" icon
3. the caught pokemon are shown in prison boxes at the top of the screen

## achieved a goal with pokenaps

1. user clicks "new pokemon!" button
2. a dice is rolled
3. if the number matches the previously-picked dice number
   1. the last pokemon jailed is removed from the list, and added back to the dex
4. end

# functions

## "new pokemon" button

- click -> reward()

  - if nothing jailed
    - getPoke()
  - if jailed
    - rollDie()

- rollDie

  - generates a number between 1 and 6
  - checks if it matches a previously stored value
  - returns the result

- getPokemon()
  - pickPokemon()
  - addPokeToDex()
    - checkDupe()
    - checkSpecial()

## "dice roll" button

- click
  - if number matches dice_num
    - collectPokemon()
  - if not, do nothin
