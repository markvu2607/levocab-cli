import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";
import chalk from "chalk";
import { createSpinner } from "nanospinner";

import { random, sleep, loading } from "./utils.js";

let data = []

async function welcome() {
  const welcomeTitle = chalkAnimation.rainbow("Hi guys! What's up?")
  await sleep()
  welcomeTitle.stop()
}

async function getQuestion() {
  await loading("Preparing question ...", async () => await sleep())

  const question = data[random(0, data.length - 1)]
  if(!question) throw new Error("Something went wrong!")

  const answer = await inquirer.prompt({
    name: "userAnswer",
    type: "list",
    message: `What is the meaning of: ${question.word}?`,
    choices: question.meaningOptions.map(option => option.meaning)
  })

  const userAnswer = answer.userAnswer
  const correctOption = question.meaningOptions.find(option => option.correct)
  await checkAnswer(correctOption.meaning === userAnswer)

  console.log(`${chalk.bold(question.word)}: ${correctOption.meaning}`)
  console.log(`${chalk.bold("Example")}: ${question.example}`)
  console.log(`-----------------------------------------------------`)
}

async function checkAnswer(isCorrect) {
  const spinner = createSpinner("Checking answer ...").start()
  await sleep(1000)
  if(isCorrect) {
    spinner.success({text: "✅ Correct answer!" })
  } else {
    spinner.error({text: "☠️ Wrong answer!" })
  }
}

async function start() {
  await welcome()
  await loading("Loading data ...", async () => {
    data = await fetch("https://raw.githubusercontent.com/markvu2607/levocab-cli/data/data.json").then(data => data.json())
  } );
  while(true) {
    await getQuestion();

    await sleep();

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
