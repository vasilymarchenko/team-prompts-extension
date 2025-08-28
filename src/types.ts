export interface TeamPrompt {
  id: string;
  keywords: string[];
  title: string;
  prompt: string;
  category?: string;
  version?: string;
  description?: string;
}

export interface PromptsConfig {
  version: string;
  prompts: TeamPrompt[];
  categories?: string[];
  lastUpdated?: string;
}