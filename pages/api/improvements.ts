import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type ResumeImprovementRequest = {
  highlight: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  if (req.method === "POST") {
    const resumeHighlightsRequest = req.body as ResumeImprovementRequest;

    const improvements = await generateHighlightImprovement(
      resumeHighlightsRequest.highlight
    );

    res.status(200).json(improvements);
  }
}

async function generateHighlightImprovement(
  highlight: string
): Promise<string[]> {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "davinci:ft-personal-2022-11-27-03-44-47",
    prompt: highlight + "\n\n###\n\n",
    temperature: 0.75,
    max_tokens: 215,
    n: 2,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["###"],
  });

  const choices: string[] = completion.data.choices.map(
    (choice) => choice.text!
  );

  return choices;
}
