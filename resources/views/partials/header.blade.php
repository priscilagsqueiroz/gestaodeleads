<!-- resources/views/partials/header.blade.php -->
<header class="header d-flex justify-content-end align-items-center mb-4">
    <button id="sidebarToggle" class="btn d-md-none">
        <i class="fas fa-bars"></i>
    </button>
    
    <div class="d-flex align-items-center">
        <div class="dropdown me-3">
            <button class="btn position-relative" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-bell"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#">New user registered</a></li>
                <li><a class="dropdown-item" href="#">New order received</a></li>
                <li><a class="dropdown-item" href="#">System update completed</a></li>
            </ul>
        </div>
        
        <div class="dropdown">
            <button class="btn d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                <div class="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center me-2" 
                     style="width: 30px; height: 30px;">
                    AD
                </div>
                <span class="d-none d-md-block">Admin</span>
                <i class="fas fa-chevron-down ms-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item" href="{{ route('logout') }}"
                       onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    </div>
</header>