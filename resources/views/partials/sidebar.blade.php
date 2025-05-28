<div class="sidebar">
    <div class="sidebar-header">
        <a href="#" class="sidebar-brand">
            <i class="fas fa-bolt"></i> YellowDash
        </a>
    </div>

    <ul class="sidebar-menu">
        <li>
            <a href="{{ route('dashboard.index') }}" class="{{ request()->routeIs('dashboard.index') ? 'active' : '' }}">
                <i class="fas fa-home"></i> Dashboard
            </a>
        </li>
        <li>
            <a href="{{ route('cadastros.index') }}" class="{{ request()->routeIs('cadastros.index') || request()->is('cadastros/*') ? 'active' : '' }}">
                <i class="fas fa-chart-line"></i> Cadastros
            </a>
        </li>
        <li>
            <a href="#">
                <i class="fas fa-users"></i> Users
            </a>
        </li>
        <li>
            <a href="#">
                <i class="fas fa-shopping-cart"></i> Products
            </a>
        </li>
        <li>
            <a href="#">
                <i class="fas fa-cog"></i> Settings
            </a>
        </li>
        <li>
            <a href="#">
                <i class="fas fa-file-alt"></i> Reports
            </a>
        </li>
        <li>
            <a href="{{ route('atendentes.index') }}" class="{{ request()->routeIs('atendentes.index') || request()->is('atendentes/*') ? 'active' : '' }}">
                <i class="fas fa-bell"></i> Atendentes
            </a>
        </li>
        <li>
            <a href="{{ route('logout') }}" class="nav-link"
                onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                <i class="fas fa-sign-out-alt me-2"></i> Logout
            </a>
            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                @csrf
            </form>
        </li>
    </ul>
</div>