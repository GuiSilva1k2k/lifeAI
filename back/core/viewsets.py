from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from core import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return Response({'message': 'Todos os campos são obrigatórios.'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'message': 'Nome de usuário já em uso.'}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({'message': 'Email já em uso.'}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)

        # Gera os tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Usuário criado com sucesso.',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=201)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email e senha são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Usuário com esse email não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        user = authenticate(username=user.username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'Login bem-sucedido',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
            })
        else:
            return Response({'message': 'Credenciais inválidas'}, status=401)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)

class ImcCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ImcSerializer(data=request.data)
        if serializers.ImcSerializer.is_valid():
            peso = serializer.validated_data['peso']
            altura = serializer.validated_data['altura']
            imc_valor = peso / (altura ** 2)

            # Classificação do IMC
            if imc_valor < 18.5:
                classificacao = "Abaixo do peso"
            elif 18.5 <= imc_valor < 25:
                classificacao = "Peso normal"
            elif 25 <= imc_valor < 30:
                classificacao = "Sobrepeso"
            else:
                classificacao = "Obesidade"

            imc_obj = serializer.save(
                id_usuario=request.user,
                imc_res=imc_valor,
                classificacao=classificacao
            )
            return Response({
                'mensagem': 'IMC registrado com sucesso.',
                'id': imc_obj.id,
                'imc': imc_valor,
                'classificacao': classificacao
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ImcBaseAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = serializers.ImcBaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(id_usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImcBaseDashAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Filtra apenas os registros do usuário logado
        registros = serializers.imc_user_base.objects.filter(id_usuario=request.user).order_by('-id')
        serializer = serializers.ImcBaseSerializer(registros, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ImcBaseRecAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Filtra apenas os registros do usuário logado
        registros = serializers.imc_user_base.objects.filter(id_usuario=request.user).order_by('-id')
        serializer = serializers.ImcBaseRecSerializer(registros, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)