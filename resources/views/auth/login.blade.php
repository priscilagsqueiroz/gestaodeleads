@extends('layouts.guest')
@section('title', 'Atendentes')
@section('content')
<div class="login-container">
    <div class="login-logo">
        <h1>YellowDash</h1>
        <p>Sistema de Gestão Escolar</p>
    </div>

    <div class="login-card">
        <div class="login-header">
            <h2>Bem-vindo de volta</h2>
            <p>Entre com suas credenciais para acessar o sistema</p>
        </div>

        <!-- Session Status -->
        <x-auth-session-status class="mb-4" :status="session('status')" />

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <!-- Email Address -->
            <div>
                <input id="email"
                    class="form-control"
                    type="email"
                    name="email"
                    :value="old('email')"
                    required
                    autofocus
                    autocomplete="username"
                    placeholder="nome@exemplo.com" />
                <x-input-error :messages="$errors->get('email')" class="mt-2" />
            </div>

            <!-- Password -->
            <div>
                <input id="password"
                    class="form-control"
                    type="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    placeholder="Senha" />
                <x-input-error :messages="$errors->get('password')" class="mt-2" />
            </div>

            <!-- Remember Me and Forgot Password -->
            <div class="remember-forgot">
                <div class="remember-me">
                    <input id="remember_me" type="checkbox" name="remember">
                    <label for="remember_me">Lembrar-me</label>
                </div>

                @if (Route::has('password.request'))
                <a class="forgot-password" href="{{ route('password.request') }}">
                    Esqueceu a senha?
                </a>
                @endif
            </div>

            <button type="submit" class="btn-login">
                Entrar
            </button>
        </form>
    </div>

    <div class="login-footer">
        <p>&copy; {{ date('Y') }} YellowDash. Todos os direitos reservados.</p>
    </div>
</div>
@endsection