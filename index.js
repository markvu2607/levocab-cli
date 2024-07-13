#! /usr/bin/env node
import {createSpinner} from "nanospinner";

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms))

const spinner = createSpinner("Preparing ...").start()
await sleep();
spinner.success()
