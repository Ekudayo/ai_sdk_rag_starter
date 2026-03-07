// import { createResource } from "@/lib/actions/resources";
// import {
//   convertToModelMessages,
//   streamText,
//   tool,
//   UIMessage,
//   stepCountIs,
// } from "ai";
// import { z } from "zod";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages }: { messages: UIMessage[] } = await req.json();

//   const result = streamText({
//     model: "openai/gpt-4o",
//     system: `You are a helpful assistant. Check your knowledge base before answering any questions.
//     Only respond to questions using information from tool calls.
//     if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
//     messages: await convertToModelMessages(messages),
//     stopWhen: stepCountIs(5),
//     tools: {
//       addResource: tool({
//         description: `add a resource to your knowledge base.
//           If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
//         inputSchema: z.object({
//           content: z
//             .string()
//             .describe("the content or resource to add to the knowledge base"),
//         }),
//         execute: async ({ content }) => createResource({ content }),
//       }),
//     },
//   });

//   return result.toUIMessageStreamResponse();
// }

// import { createResource } from "@/lib/actions/resources";
// import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
// import { groq } from "@ai-sdk/groq"; // Switched to Groq
// import { z } from "zod";
// import { findRelevantContent } from "@/lib/ai/embedding";

// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages }: { messages: UIMessage[] } = await req.json();

//   const result = streamText({
//     // Use Llama 3.3 - it is powerful and free on Groq
//     model: groq("llama-3.3-70b-versatile"),
//     messages: await convertToModelMessages(messages),
//     maxSteps: 5,
//     system: `You are a helpful assistant. Check your knowledge base before answering any questions.
//     Only respond to questions using information from tool calls.
//     if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
//     tools: {
//       addResource: tool({
//         description: `add a resource to your knowledge base.`,
//         execute: async ({ content }) => createResource({ content }),
//         parameters: z.object({
//           content: z.string().describe("the content to add"),
//         }),
//       }),
//       getInformation: tool({
//         description: `get information from your knowledge base to answer questions.`,
//         execute: async ({ question }) => findRelevantContent(question),
//         parameters: z.object({
//           question: z.string().describe("the users question"),
//         }),
//       }),
//     },
//   });

//  return result.toAIStreamResponse();
// }export const dynamic = "force-dynamic";

// import { createResource } from "@/lib/actions/resources";
// import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
// import { z } from "zod";
// import { groq } from "@ai-sdk/groq";

// export const maxDuration = 30;

// export async function POST(req: Request) {
//   try {
//     const { messages }: { messages: UIMessage[] } = await req.json();

//     // Initialize inside the handler to prevent build-time crashes
//     const model = groq("llama-3.3-70b-versatile");

//     const result = streamText({
//       model: model,
//       system: `You are a helpful assistant. Check your knowledge base using the 'getInformation' tool to answer specific questions.`,
//       messages: await convertToModelMessages(messages),
//       tools: {
//         addResource: tool({
//           description: `add a resource to your knowledge base.`,
//           inputSchema: z.object({
//             content: z.string().describe("the content to add"),
//           }),
//           execute: async ({ content }) => createResource({ content }),
//         }),
//       },
//     });

//     return result.toUIMessageStreamResponse();
//   } catch (error) {
//     console.error("Build/Runtime Error:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }


export const dynamic = "force-dynamic";
import { createResource } from "@/lib/actions/resources";
import { convertToModelMessages, streamText, tool, UIMessage } from "ai";
import { z } from "zod";
import { groq } from "@ai-sdk/groq";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Initialize inside the handler to prevent build-time crashes
    const model = groq("llama-3.3-70b-versatile");

    const result = streamText({
      model: model,
      system: `You are a helpful assistant. Check your knowledge base using the 'getInformation' tool to answer specific questions.`,
      messages: await convertToModelMessages(messages),
      tools: {
        addResource: tool({
          description: `add a resource to your knowledge base.`,
          inputSchema: z.object({
            content: z.string().describe("the content to add"),
          }),
          execute: async ({ content }) => createResource({ content }),
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Build/Runtime Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}