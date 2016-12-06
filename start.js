#!/usr/bin/env node
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let totalValue = {};
let inputObject = new Map();
const hands = {one: 1, two: 2};
const poker = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
}

function setMapValue(mapBag, value) {
  mapBag.set(value,(mapBag.get(value) ? (mapBag.get(value)+1) : 1 ));
  if (mapBag.get(value) >= 5) {
    throw Error(3);
  }
  return mapBag;
}

function calculate(input){
  let inputPoker = new Map();
  input.map(item => {
    const value = poker[item];
    if (!value) {
      throw Error(1);
    }
    inputPoker = setMapValue(inputPoker, value);
    inputObject = setMapValue(inputObject, value);
  });

  let total = 0;
  if ((input[4] - input[0]) === 4) {
    for (let key of inputPoker.keys()) {
      total = total + 10000*key;
    }
  } else {
    for (let [key, value] of inputPoker.entries()) {
      total = total + key*value*Number(`1${'0'.repeat(value-1)}`);
    }
  }
  return total;
}

function validateInput(inputs) {
  const inputNumberArray = inputs.split(',').map(item => item.trim());
  if (inputNumberArray.length !== 5) {
    throw Error(2);
  }
  return inputNumberArray;
}

function handleInput(key, answer) {
  try{
    totalValue[key] = calculate(validateInput(answer));
  } catch (e) {
    inputObject = new Map();
    console.log('Impossible hand!');
    playPoker();
  }
}

function playPoker() {
  rl.question("Enter a hand\n", (answer1) => {
    handleInput(hands.one, answer1);
    rl.question("Enter another hand\n", (answer2) => {
      handleInput(hands.two, answer2);

      if (totalValue[hands.one] > totalValue[hands.two]) {
        console.log(`${answer1} is the stronger hand`);
      } else if (totalValue[hands.one] < totalValue[hands.two]){
        console.log(`${answer2} is the stronger hand`);
      } else {
        console.log('God,the same!');
      }
      totalValue = {};
      playPoker();
    });
  });
}
playPoker();




