const LLM_API_KEY = process.env.LLM_API_KEY!;
const LLM_BASE_URL = process.env.LLM_BASE_URL!;
const LLM_MODEL= process.env.LLM_MODEL!;

interface ToolCall {
    id:string;
    function: {
        name: string;
        arguments: string;
    };
}

interface LLMResponse {
    role: "assistant";
    content: string | null;
    toolCalls: ToolCall[] | null;
}

export async function callLLM(
    messages: Array<{role:string; content:string|null; tool_call_id?: string; tool_calls?: any}>,
    tools: Array<object>,
):Promise<LLMResponse> {
    const body: Record<string,unknown> = {
        model: LLM_MODEL,
        messages,
    };

    if (tools.length > 0){
        body.tools = tools;
    }

    const response = await fetch(`${LLM_BASE_URL}/v1/chat/completions`,{
        method:"POST",
        headers: {
        "Authorization": `Bearer ${LLM_API_KEY}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if(!response.ok){
        const text = await response.text();
        throw new Error(`LLM调用失败: ${response.status} ${text}`);
    }

    const data = await response.json();
    const choice = data.choices[0];
    const message = choice.message;

    return {
    role: "assistant",
    content: message.content || null,
    toolCalls:message.tool_calls || null,
    };

}