from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return Response(
                {'success': False, 'message': 'Todos os campos são obrigatórios.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'success': False, 'message': 'Nome de usuário já está em uso.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'success': False, 'message': 'Email já está em uso.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username, email=email, password=password
        )
        login(request, user)

        return Response(
            {'success': True, 'message': 'Usuário criado com sucesso.'},
            status=status.HTTP_201_CREATED
        )

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
            return Response({
                "message": "Login bem-sucedido",
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
            })
        else:
            return Response({"error": "Senha incorreta."}, status=status.HTTP_401_UNAUTHORIZED)
