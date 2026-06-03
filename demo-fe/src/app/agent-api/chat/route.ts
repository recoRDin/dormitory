  import { NextRequest, NextResponse } from "next/server";
  import { callLLM } from "@/api/agent/llm";
  import { getToolSchemas, executeTool } from "@/api/agent/tools";
  import { SYSTEM_PROMPT } from "@/api/agent/prompt";
   

export async function POST(request: NextRequest){
    try {
        const{ question } = await request.json();

        const messages: Array<{role: string; content: string; tool_call_id?: string}> = [
            {role: "system",content: SYSTEM_PROMPT},
            {role: "user",content: question},
        ];

        //调用LLM

        let response = await callLLM(messages,getToolSchemas());
        let loop = 0;

        while (response.toolCalls && loop<5){
            loop++;

            //把LLM的工具调用请求加入对话历史
            messages.push({
                role:"assistant",
                content: null,
                tool_calls: response.toolCalls,
            });

            for(const toolCall of response.toolCalls){
                const args = JSON.parse(toolCall.function.arguments);
                const result = await executeTool(toolCall.function.name,args);

                //把工具执行结果加入到对话历史中
                messages.push({
                    role: "tool",
                    content: JSON.stringify(result),
                    tool_call_id: toolCall.id,
                });
            }

            //再次调用LLM
            response = await callLLM(messages,getToolSchemas());
        }
        //返回最终文本回复
        return NextResponse.json({
            answer: response.content || "抱歉无法回复这个问题",
        });
    } catch(error) {
    
        return NextResponse.json(
            {answer:`出错了：${(error as Error).message}`},
            { status: 500},
        );
    }
}