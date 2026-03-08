// Ensure the API URL is never an empty string and provide a helpful warning
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!rawApiUrl && typeof window !== 'undefined') {
    console.warn("⚠️ NEXT_PUBLIC_API_URL is not defined in the environment. Falling back to localhost for development.");
}

export const API_BASE_URL = rawApiUrl || 'http://localhost:8000/api';

export interface AuditResult {
    score: number;
    missing_values: number;
    duplicates: number;
    outliers: number;
    status: string;
}

export interface BiasResult {
    bias_score: number;
    demographic_parity: number;
    equal_opportunity: number;
    disparate_impact: number;
    issues: string[];
}

export interface SimulationResult {
    overall_risk_score: number;
    risk_category: string;
    simulated_scenarios: Array<{ name: string; impact: string }>;
    explanation: string;
}

export const api = {
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch(`${API_BASE_URL}/upload/`, {
            method: 'POST',
            body: formData,
        });
        return response.json();
    },

    runAudit: async (): Promise<AuditResult> => {
        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch(`${API_BASE_URL}/audit/`, { method: 'POST' });
        return response.json();
    },

    runBiasDetection: async (): Promise<BiasResult> => {
        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 2500));
        const response = await fetch(`${API_BASE_URL}/bias/`, { method: 'POST' });
        return response.json();
    },

    runSimulation: async (): Promise<SimulationResult> => {
        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 3000));
        const response = await fetch(`${API_BASE_URL}/simulate/`, { method: 'POST' });
        return response.json();
    },

    getAIExplanation: async (metrics: any) => {
        const response = await fetch(`${API_BASE_URL}/ai/explain/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metrics }),
        });
        return response.json();
    },

    chatWithAI: async (message: string, dataset_context: string = "") => {
        const response = await fetch(`${API_BASE_URL}/ai/chat/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, dataset_context }),
        });
        return response.json();
    },

    generateReport: async (format: string = "markdown") => {
        const response = await fetch(`${API_BASE_URL}/ai/report/?format=${format}`);
        if (format === "json") return response.json();
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trustiq_report.${format === 'markdown' ? 'md' : format}`;
        a.click();
    },

    generateSyntheticSchema: async (prompt: string) => {
        const response = await fetch(`${API_BASE_URL}/ai/generate_schema/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to generate schema');
        }
        return response.json();
    }
};
