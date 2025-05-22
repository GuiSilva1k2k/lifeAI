import requests
import os
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

LM_API_URL = os.getenv("LM_API_URL")
LM_API_MODEL = os.getenv("LM_API_MODEL")

def perguntar_ia_lm_studio(pergunta):
    payload = {
        "model": LM_API_MODEL,  # Substitua pelo nome do modelo que você carregou
        "messages": [
            {"role": "system", "content": "Você é um assistente útil."},
            {"role": "user", "content": pergunta}
        ],
        "temperature": 0.7
    }

    try:
        resposta = requests.post(LM_API_URL, json=payload)
        resposta.raise_for_status()
        dados = resposta.json()
        conteudo = dados["choices"][0]["message"]["content"]
        return conteudo.strip()
    except Exception as e:
        return f"Erro ao consultar LM Studio: {e}"

# Exemplo de uso
if __name__ == "__main__":
    pergunta = input("Digite sua pergunta: ")
    resposta = perguntar_ia_lm_studio(pergunta)
    print("Resposta da IA:", resposta)
