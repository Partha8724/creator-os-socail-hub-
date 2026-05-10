export interface ArchitectResponse {
  feature_type: string;
  prediction_score: number;
  actionable_steps: string[];
  ai_draft: string;
  reasoning: string;
}

export const architectService = {
  async analyzeTask(taskId: string, contextData: string): Promise<ArchitectResponse> {
    const response = await fetch('/api/growth/architect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, context_data: contextData })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Architect analysis component failure');
    }

    return response.json();
  }
};
