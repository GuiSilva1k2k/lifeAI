import os
import requests
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

load_dotenv()

LM_API_URL = os.getenv("LM_API_URL")
LM_API_MODEL = os.getenv("LM_API_MODEL")

def perguntar_ia_lm_studio(pergunta):
    prompt_sistema = (
        "Você é um assistente especializado em SAÚDE e BEM-ESTAR. "
        "Você deve responder apenas perguntas relacionadas à saúde física, saúde mental, alimentação saudável, atividade física, autocuidado, sono, prevenção de doenças, qualidade de vida e temas correlatos. "
        "Se a pergunta for sobre qualquer outro assunto que não envolva saúde ou bem-estar, responda educadamente que só pode responder perguntas sobre saúde."
    )

    payload = {
        "model": LM_API_MODEL,
        "messages": [
            {"role": "system", "content": prompt_sistema},
            {"role": "user", "content": pergunta}
        ],
        "temperature": 0.7
    }

    resposta = requests.post(LM_API_URL, json=payload)
    resposta.raise_for_status()
    dados = resposta.json()
    return dados["choices"][0]["message"]["content"].strip()

@api_view(['POST'])
def chat_ia_view(request):
    pergunta = request.data.get("pergunta")
    if not pergunta:
        return Response({"erro": "Pergunta é obrigatória."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        resposta = perguntar_ia_lm_studio(pergunta)
        return Response({"resposta": resposta})
    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
