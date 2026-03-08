import os
import json
from typing import List, Dict, Any
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

class RAGEngine:
    def __init__(self, model_name=None, persist_directory=None):
        self.model_name = model_name or os.getenv("LLM_MODEL", "llama3.1:latest")
        self.persist_directory = persist_directory or os.getenv("PERSIST_DIRECTORY", "./chroma_db")
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        
        self.embeddings = None
        self.llm = None
        self.vectorstore = None
        self._initialized = False

    def _ensure_initialized(self):
        """Initializes ML models and vector database lazily to prevent blocking server boot."""
        if self._initialized:
            return

        print("Initializing ML models and vector database...")
        # Use Google Embeddings if API key is present to save RAM, otherwise fallback to local HuggingFace
        if self.google_api_key:
            self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=self.google_api_key)
            self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=self.google_api_key)
        else:
            self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
            self.llm = OllamaLLM(model=self.model_name, base_url=self.ollama_base_url)
        
        self._initialize_vectorstore()
        self._initialized = True

    def _initialize_vectorstore(self):
        """Initializes or loads the vector store from the local knowledge base."""
        kb_path = os.path.join(os.path.dirname(__file__), "..", "data", "knowledge_base.json")
        if not os.path.exists(kb_path):
            print(f"Knowledge base not found at {kb_path}")
            return

        with open(kb_path, "r") as f:
            kb_data = json.load(f)

        documents = []
        for entry in kb_data:
            content = (
                f"Topic: {entry['topic']}\n"
                f"Explanation: {entry['explanation']}\n"
                f"Risk: {entry['risk']}\n"
                f"Detection Method: {entry['detection_method']}\n"
                f"Suggested Fix: {entry['suggested_fix']}\n"
                f"Example Scenario: {entry['example_scenario']}"
            )
            documents.append(Document(page_content=content, metadata={"topic": entry['topic']}))

        # Create or load the Chroma vectorstore
        self.vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory=self.persist_directory
        )

    def query(self, user_query: str, dataset_context: str = "") -> str:
        """Retrieves relevant knowledge and generates an AI response."""
        self._ensure_initialized()
        
        if not self.vectorstore:
            return "Knowledge base not initialized."

        # Search for top-2 relevant snippets from the knowledge base
        docs = self.vectorstore.similarity_search(user_query, k=2)
        kb_context = "\n\n".join([doc.page_content for doc in docs])

        template = """
        You are a Senior AI Architect and Data Scientist for 'Trustiq', an AI Data Governance Platform.
        Your goal is to help users understand their dataset risks and provide technical guidance.

        ### KNOWLEDGE BASE CONTEXT:
        {kb_context}

        ### DATASET METRICS & FINDINGS:
        {dataset_context}

        ### USER QUESTION:
        {user_query}

        ### RESPONSE:
        (Provide a detailed, professional, and actionable response based on the context above. If the dataset metrics are provided, use them to customize your advice.)
        """
        
        prompt = template.format(
            kb_context=kb_context,
            dataset_context=dataset_context,
            user_query=user_query
        )

        try:
            res = self.llm.invoke(prompt)
            # Gemini might return an AIMessage object instead of just string
            if hasattr(res, 'content'):
                return res.content
            return str(res)
        except Exception as e:
            return f"Error generating response: {str(e)}"

    def generate_dataset_schema(self, user_request: str) -> str:
        """Generates a synthetic dataset JSON schema based on the user's description."""
        self._ensure_initialized()
        
        template = """
        You are an expert data scientist and synthetic dataset architect.
        Your task is to convert a user's natural language request into a structured dataset schema that will be used by a Python data generator.
        
        Analyze the request and produce a structured JSON schema.
        
        The schema must contain:
        dataset_name, description, rows, features, target_column, missing_value_ratio, noise_level, outlier_ratio
        
        For each feature include:
        name, type (numeric, categorical, boolean), distribution (normal, uniform, skewed), min_value, max_value, possible_categories (if categorical)
        
        The target_column must contain:
        name, type, class_distribution
        
        The schema must be optimized for generating synthetic datasets for machine learning training.
        
        The output MUST be strictly valid JSON and contain NO other text or explanation. DO NOT use markdown code formatting. Only return valid JSON.

        ### USER REQUEST:
        {user_request}
        """
        
        prompt = template.format(user_request=user_request)
        
        try:
            # We enforce JSON output strictly; we could use Ollama's format="json" param if supported, but standard invoke usually works well if prompted heavily.
            schema_json = self.llm.invoke(prompt)
            # Basic cleanup in case Ollama wraps it in ```json ... ```
            if "```json" in schema_json:
                schema_json = schema_json.split("```json")[-1].split("```")[0].strip()
            elif "```" in schema_json:
                schema_json = schema_json.split("```")[-1].split("```")[0].strip()
                
            return schema_json
        except Exception as e:
            raise Exception(f"Failed to generate schema: {str(e)}")

# Singleton instance
rag_engine = RAGEngine()
