import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import chalk from "chalk";
import { createSpinner } from "nanospinner";

import { random, sleep, shuffle } from "./utils.js";

let data = []

async function welcome() {
  const welcomeTitle = chalkAnimation.rainbow("Hi guys! What's up?")
  await sleep()
  welcomeTitle.stop()
}

async function getQuestion() {
  let question;
  const spinner = createSpinner("Generating question ...").start()
  await sleep()
  question = generateQuestion(data)
  spinner.success({text: "Generated question."})

  if(!question) throw new Error("Something went wrong!")

  const answer = await inquirer.prompt({
    name: "userAnswer",
    type: "list",
    message: `What is the meaning of: ${question.word}?`,
    choices: question.meaningOptions
  })

  const userAnswer = answer.userAnswer
  await checkAnswer(question.meaning === userAnswer)

  const spinner2 = createSpinner("Loading detail ...").start()
  await sleep()
  spinner2.success({text: `
    ${chalk.bold(question.word)}: ${question.meaning}
    ${chalk.bold("Example")}: ${question.example}
  `})
}

function generateQuestion(data) {
  const selectedWordsIndex = []
  const meaningOptions = []

  let randomIndex = random(0, data.length - 1)
  const randomWord = data[randomIndex]
  selectedWordsIndex.push(randomIndex);
  meaningOptions.push(randomWord.meaning)

  while(selectedWordsIndex.length < 3) {
    randomIndex = random(0, data.length - 1)
    if(selectedWordsIndex.includes(randomIndex)) continue
    selectedWordsIndex.push(randomIndex)
    meaningOptions.push(data[randomIndex].meaning)
  }

  return {
    ...randomWord,
    meaningOptions: shuffle(meaningOptions)
  }
}

async function checkAnswer(isCorrect) {
  const spinner = createSpinner("Checking answer ...").start()
  await sleep()
  if(isCorrect) {
    spinner.success({text: "✅ Correct answer!" })
  } else {
    spinner.error({text: "☠️ Wrong answer!" })
  }
}

async function start() {
  await welcome()

  const spinner = createSpinner("Loading data ...").start()
  data = await fetch("https://raw.githubusercontent.com/markvu2607/levocab-cli/data/data.json").then(data => data.json())
  spinner.success({text: "Loaded data."})

  while(true) {
    await getQuestion();

    await sleep();
    console.log(`-----------------------------------------------------`)
    const answer = await inquirer.prompt({
      name: "isContinue",
      type: "list",
      message: `Do you want to go to the next question?`,
      choices: ["Yes", "No"]
    })
    if(answer.isContinue === "No") {
      break
    }
  }
}

export {
  start
}
