@extends('layouts.app')
@section('title', 'YellowDash')
@section('content')
<div class="row">
    <div class="col-12">
        <h2 class="mb-4">Dashboard Overview</h2>
    </div>
</div>

<!-- Stats Row -->
<div class="row">
    <div class="col-md-3">
        <div class="card stat-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 class="stat-value">2,450</h4>
                        <p class="stat-label">Total Users</p>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card stat-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 class="stat-value">$12,580</h4>
                        <p class="stat-label">Total Revenue</p>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card stat-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 class="stat-value">356</h4>
                        <p class="stat-label">New Orders</p>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-3">
        <div class="card stat-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 class="stat-value">85%</h4>
                        <p class="stat-label">Satisfaction Rate</p>
                    </div>
                    <div class="stat-icon">
                        <i class="fas fa-smile"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Charts Row -->
<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header">
                Sales Overview
            </div>
            <div class="card-body">
                <canvas id="salesChart" height="300"></canvas>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card">
            <div class="card-header">
                Traffic Sources
            </div>
            <div class="card-body">
                <canvas id="trafficChart" height="300"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Recent Activity -->
<div class="row">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                Recent Orders
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#ORD-001</td>
                                <td>John Smith</td>
                                <td><span class="badge bg-success">Completed</span></td>
                                <td>$120.00</td>
                            </tr>
                            <tr>
                                <td>#ORD-002</td>
                                <td>Alice Johnson</td>
                                <td><span class="badge bg-warning text-dark">Pending</span></td>
                                <td>$75.50</td>
                            </tr>
                            <tr>
                                <td>#ORD-003</td>
                                <td>Robert Brown</td>
                                <td><span class="badge bg-info">Processing</span></td>
                                <td>$220.00</td>
                            </tr>
                            <tr>
                                <td>#ORD-004</td>
                                <td>Emily Davis</td>
                                <td><span class="badge bg-success">Completed</span></td>
                                <td>$65.25</td>
                            </tr>
                            <tr>
                                <td>#ORD-005</td>
                                <td>Michael Wilson</td>
                                <td><span class="badge bg-danger">Cancelled</span></td>
                                <td>$190.75</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="text-end mt-3">
                    <a href="#" class="btn btn-primary btn-sm">View All Orders</a>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                Recent Activities
            </div>
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item px-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="fas fa-user-plus text-primary me-2"></i>
                                <span>New user registered</span>
                            </div>
                            <small class="text-muted">5 min ago</small>
                        </div>
                    </li>
                    <li class="list-group-item px-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="fas fa-shopping-cart text-success me-2"></i>
                                <span>New order placed</span>
                            </div>
                            <small class="text-muted">15 min ago</small>
                        </div>
                    </li>
                    <li class="list-group-item px-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                                <span>System alert</span>
                            </div>
                            <small class="text-muted">30 min ago</small>
                        </div>
                    </li>
                    <li class="list-group-item px-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="fas fa-credit-card text-info me-2"></i>
                                <span>Payment received</span>
                            </div>
                            <small class="text-muted">1 hour ago</small>
                        </div>
                    </li>
                    <li class="list-group-item px-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <i class="fas fa-comment text-primary me-2"></i>
                                <span>New comment</span>
                            </div>
                            <small class="text-muted">2 hours ago</small>
                        </div>
                    </li>
                </ul>
                <div class="text-end mt-3">
                    <a href="#" class="btn btn-primary btn-sm">View All Activities</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection