import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-ess-dashboard',
  imports: [],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div>
          <h1>ESS Dashboard</h1>
          <p>Employee Self Service Portal</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon" style="background: #2563eb20; color: #2563eb">📋</span>
            <span class="stat-value">0</span>
          </div>
          <h3 class="stat-title">My Leave Requests</h3>
          <p class="stat-change">Pending approval</p>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon" style="background: #10b98120; color: #10b981">✅</span>
            <span class="stat-value">100%</span>
          </div>
          <h3 class="stat-title">Attendance Today</h3>
          <p class="stat-change">Checked in</p>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon" style="background: #f59e0b20; color: #f59e0b">📅</span>
            <span class="stat-value">15</span>
          </div>
          <h3 class="stat-title">Available Leaves</h3>
          <p class="stat-change">Days remaining</p>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon" style="background: #8b5cf620; color: #8b5cf6">👤</span>
            <span class="stat-value">1</span>
          </div>
          <h3 class="stat-title">My Profile</h3>
          <p class="stat-change">View & Update</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div class="quick-actions">
          <button class="action-button">
            <span class="action-icon">📝</span>
            <span>Apply Leave</span>
          </button>
          <button class="action-button">
            <span class="action-icon">📋</span>
            <span>View Attendance</span>
          </button>
          <button class="action-button">
            <span class="action-icon">👤</span>
            <span>Update Profile</span>
          </button>
          <button class="action-button">
            <span class="action-icon">📊</span>
            <span>View Payslip</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .dashboard-header p {
      color: #6b7280;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.75rem;
      font-size: 1.5rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
    }

    .stat-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
    }

    .stat-change {
      font-size: 0.75rem;
      color: #10b981;
      margin: 0;
    }

    .card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .card-header {
      margin-bottom: 1.25rem;
    }

    .card-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.75rem;
    }

    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.25rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-button:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-button span:last-child {
      font-size: 0.75rem;
      font-weight: 500;
      color: #374151;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EssDashboard {}

