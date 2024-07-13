import { createSpinner } from "nanospinner";

export const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms))

export const random = (from, to) => {
  if(to < from) throw new Error("Invalid value");
  return Math.floor(Math.random() * (to - from + 1) + from);
}

export const loading = async (text, cb) => {
  const spinner = createSpinner(text).start()
  await cb()
  spinner.success()
}
