
import openai from "@/openai";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();
  // console.log(todos);

  //   communicate with openAI GPT
  // const response = await openai.chat.completions.create({
  //   const response = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   temperature: 0.8,
  //   n: 1,
  //   stream: false,
  //   messages: [
  //     { 
  //       role: "system",
  //       content: `When responding, Welcome the user always as Mr.Snehal and say welcome to the Opas! Limit the response to 200 charcters`,
  //     },
  //     {
  //       role: "user",
  //       content: `Hii there, provide a summary of the followinf todos. Count how many todos are in each category such as To do, in progress and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(
  //         todos
  //       )}`,
  //     },
  //   ],
  // });

  // const { data } = response;

  // console.log("DATA IS: ", data);
  // console.log(data.choices[0].message);
  
  // return NextResponse.json(data.choices[0].message);
  return NextResponse.json(todos);
}
