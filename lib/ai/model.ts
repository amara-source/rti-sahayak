export interface StructuredModelRequest {
  instructions: string;
  input: string;
  maxOutputTokens: number;
  name: string;
  schema: Record<string, unknown>;
}

export interface TextModelRequest {
  instructions: string;
  input: string;
  maxOutputTokens: number;
}

export interface ModelGateway {
  generateStructured(request: StructuredModelRequest): Promise<unknown>;
  generateText(request: TextModelRequest): Promise<string>;
}
