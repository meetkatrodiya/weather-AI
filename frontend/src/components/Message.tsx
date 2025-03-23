import React from "react";
import { Weather } from "./Weather";
import { BarChart } from "./BarChart";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolInvocations?: Array<{
    toolName: string;
    toolCallId: string;
    state: string;
    result?: any;
  }>;
}

export default function Message({ message }: { message: Message }) {
  // Parse the content if it's a JSON string
  let parsedContent = message.content;
  let toolInvocations = message.toolInvocations;

  try {
    if (typeof message.content === 'string' && message.content.startsWith('{')) {
      const parsed = JSON.parse(message.content);
      parsedContent = parsed.content;
      toolInvocations = parsed.toolInvocations;
    }
  } catch (e) {
    console.error('Error parsing message content:', e);
  }

  return (
    <div
      className={`flex gap-5 p-4 ${
        message.role === "assistant" ? "bg-gray-900 rounded-lg text-white" : ""
      }`}
    >
      <div className="text-sm text-white">
        {message.role === "user" ? "U" : "A"}
      </div>
      <div className="text-sm text-white">{parsedContent}</div>

      {toolInvocations?.map((tool) => {
        const { toolName, toolCallId, state } = tool;
        if (state === "result") {
          if (toolName === "getWeather") {
            return (
              <Weather
                key={toolCallId}
                toolCallId={toolCallId}
                {...tool.result}
              />
            );
          }
          if (toolName === "getPopulationData") {
            return (
              <BarChart
                key={toolCallId}
                toolCallId={toolCallId}
                data={tool.result.data}
              />
            );
          }
        } else {
          if (toolName === "getWeather" || toolName === "getPopulationData") {
            return <div key={toolCallId}>Loading data...</div>;
          }
        }
        return null;
      })}
    </div>
  );
}