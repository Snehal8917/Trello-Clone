import {  OpenAI } from "openai";
import Configuration from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  // apiKey: "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",
});
const openai = new OpenAI();
// const response =  openai.listEngines();
// console.log("🚀 ~ file: openai.ts:11 ~ respon̥se:", response)

export default openai;
