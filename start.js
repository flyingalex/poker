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
  if (mapBag.get(value) >= 5) throw Error(3);
  return mapBag;
}

function calculate(input){
  input = input.sort();
  let inputPoker = new Map();
  input.map(value => {
    if (!value) throw Error(1);
    inputPoker = setMapValue(inputPoker, value);
    inputObject = setMapValue(inputObject, value);
  });

  let total = 0;
  // 5 different rule
  if (inputPoker.size === 5) {
    const isEqual = (input[1] + input[2] + input[3]) + input[4] === input[0];
    if ((input[4] - input[0]) === 4 || (isEqual && input[0] === 14)) {
      for (let key of inputPoker.keys()) {
        total = total + 100000*key;
      }
    } else {
      for (let [key, value] of inputPoker.entries()) {
        total = total + key*value*Number(`1${'00'.repeat(value-1)}`);
      }
    }
  } else {
    // others rules
    for (let [key, value] of inputPoker.entries()) {
      total = total + key*value*Number(`1${'00'.repeat(value-1)}`);
    }
  }
  return total;
}

function validateAndTranslateInput(inputs) {
  const inputNumberArray = inputs.split(',').map(item => item.trim()).sort();
  if (inputNumberArray.length !== 5) throw Error(2);
  return inputNumberArray.map(item => poker[item]);
}

function reStart() {
  totalValue = {};
  inputObject = new Map();
  playPoker();
}

function handleInput(key, answer) {
  try{
    totalValue[key] = calculate(validateAndTranslateInput(answer));
  } catch (e) {
    console.log('Impossible hand!');
    reStart();
  }
}

function playPoker() {
  rl.question("Enter a hand\n", (answer1) => {
    handleInput(hands.one, answer1);
    rl.question("Enter another hand\n", (answer2) => {
      handleInput(hands.two, answer2);

      if (Object.keys(totalValue).length !== 0) {
        if (totalValue[hands.one] > totalValue[hands.two]) {
          console.log(`${answer1} is the stronger hand`);
        } else if (totalValue[hands.one] < totalValue[hands.two]){
          console.log(`${answer2} is the stronger hand`);
        } else {
          console.log('G2,2,2,2od,the same!');
        }
        reStart();
      }
    });
  });
}
playPoker();

