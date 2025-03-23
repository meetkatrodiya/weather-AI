import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { generateText, streamText, tool } from 'ai';
import { openai } from "@ai-sdk/openai";
import { custom, z } from 'zod';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const maxDuration = 30;
dotenv.config();

const router = express.Router();

router.post('/chat', async (req, res) => {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { messages } = req.body;

  try {
    const result = await generateText({
      model: openrouter
        ("google/gemini-2.0-flash-lite-preview-02-05:free"),
      prompt: messages[messages.length - 1].content,
      tools: {
        getWeather: tool({
          description: 'Get the weather in a location',
          parameters: z.object({
            location: z.string().describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => {
            try {
              const weatherPrompt = `
                What is the current typical temperature in ${location}? 
                Respond only with a JSON object in this exact format:
                {
                  "location": "${location}",
                  "temperature": number_in_celsius,
                  "weather": "sunny" or "cloudy" or "rainy" or "snow"
                }
                Base the weather condition on the typical weather for this location and season.
              `;

              const weatherResponse = await generateText({
                model: openrouter("google/gemini-2.0-flash-lite-preview-02-05:free"),
                prompt: weatherPrompt,
              });

              // Parse the JSON response
              const jsonMatch = weatherResponse.text.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const weatherData = JSON.parse(jsonMatch[0]);
                return {
                  location: weatherData.location,
                  temperature: Math.round(weatherData.temperature),
                  weather: weatherData.weather.toLowerCase()
                };
              }

              throw new Error("Could not parse weather data");
            } catch (error) {
              console.error('Weather data error:', error);
              // Fallback response
              return {
                location,
                temperature: 22,
                weather: 'sunny'
              };
            }
          },
        }),
        getPopulationData: tool({
          description: 'Get population data for continents or countries in millions',
          parameters: z.object({
            query: z.string().describe("A question about population data"),
          }),
          execute: async ({ query }) => {
            const populationPrompt = `
              Based on this query: "${query}", provide population data in the following JSON format:
              {
                "data": [
                  { "continent": "Region1", "population": number },
                  { "continent": "Region2", "population": number }
                ]
              }
              The population should be in millions. Ensure the response is valid JSON.
            `;

            try {
              const populationResponse = await generateText({
                model: openrouter("meta-llama/llama-3.2-1b-instruct:free"),
                prompt: populationPrompt,
              });

              let parsedData;
              try {
                parsedData = JSON.parse(populationResponse.text);
              } catch (err) {
                const jsonMatch = populationResponse.text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  parsedData = JSON.parse(jsonMatch[0]);
                } else {
                  throw new Error("Could not parse JSON from response");
                }
              }

              if (!parsedData.data || !Array.isArray(parsedData.data)) {
                throw new Error("Invalid data structure");
              }

              return parsedData;
            } catch (err) {
              console.error("Error processing population data:", err);
              return {
                data: [
                  { continent: 'Asia', population: 4700 },
                  { continent: 'Africa', population: 1400 },
                  { continent: 'Europe', population: 750 },
                  { continent: 'North America', population: 600 },
                  { continent: 'South America', population: 430 },
                  { continent: 'Oceania', population: 43 },
                ]
              };
            }
          },
        }),
      },
    });

    // Process tool results if any tool was used
    if (result.toolResults && result.toolResults.length > 0) {
      for (const toolResult of result.toolResults) {
        switch (toolResult.toolName) {
          case 'getWeather':
            return res.json({
              role: "assistant",
              content: "Here is the weather information you requested:",
              toolInvocations: [{
                toolName: 'getWeather',
                toolCallId: toolResult.toolCallId,
                state: "result",
                result: toolResult.result
              }]
            });

          case 'getPopulationData':
            return res.json({
              role: "assistant",
              toolInvocations: [{
                toolName: 'getPopulationData',
                toolCallId: toolResult.toolCallId,
                state: "result",
                result: toolResult.result
              }]
            });

          default:
            try {
              console.log('default............')
              const customResult = await generateText({
                model: openrouter("meta-llama/llama-3.2-1b-instruct:free"),
                prompt: messages,
              });
              return res.json(customResult.text)

            }
            catch (err) {
              return res.json({
                id: Date.now().toString(),
                role: "assistant",
                content: result.text || "I'm not sure how to respond to that.",
              });
            }
        }
      }
    }
    console.log('returning default response')
    const customResult =  streamText({
      model: openrouter("google/gemini-2.0-flash-lite-preview-02-05:free"),
      prompt: messages[messages.length - 1].content,
    });

    for await (const textPart of customResult.textStream) {
      console.log(textPart)
      res.write(textPart);
    }
    res.end();
    
  
    // console.log(textStream)
    // for await (const textPart of textStream) {
    //   res.write(textPart);
    // }
    // res.end();
    // If no tool was used, return default LLM response


  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
