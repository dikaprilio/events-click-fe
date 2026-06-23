'use client';

import Link from 'next/link';
import { usePosts } from '@/hooks/use-posts';
import { useEquipments } from '@/hooks/use-equipments';
import { useClients } from '@/hooks/use-clients';
import { useUsers } from '@/hooks/use-admin-users';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboardPage() {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: equipments, isLoading: equipmentsLoading } = useEquipments({ limit: 100 });
  const { data: clients, isLoading: clientsLoading } = useClients({ limit: 100 });
  const { data: users, isLoading: usersLoading } = useUsers();
  const { user } = useAuth();

  const stats = [
    { 
      label: 'Total Posts', 
      value: postsLoading ? '...' : posts?.length || 0, 
      href: '/admin/posts', 
      color: 'bg-blue-500',
      icon: PostIcon
    },
    { 
      label: 'Equipment', 
      value: equipmentsLoading ? '...' : equipments?.length || 0, 
      href: '/admin/equipments', 
      color: 'bg-green-500',
      icon: EquipmentIcon
    },
    { 
      label: 'Clients', 
      value: clientsLoading ? '...' : clients?.length || 0, 
      href: '/admin/clients', 
      color: 'bg-purple-500',
      icon: ClientsIcon
    },
    { 
      label: 'Users', 
      value: usersLoading ? '...' : users?.length || 0, 
      href: '/admin/users', 
      color: 'bg-orange-500',
      icon: UsersIcon
    },
  ];

  const quickActions = [
    { label: 'Add New Post', href: '/admin/posts/new', description: 'Create a new blog post', icon: PlusIcon },
    { label: 'Add Equipment', href: '/admin/equipments/new', description: 'Add new equipment item', icon: PlusIcon },
    { label: 'Add Client', href: '/admin/clients/new', description: 'Add new client logo', icon: PlusIcon },
    { label: 'Add User', href: '/admin/users/new', description: 'Create new admin account', icon: PlusIcon },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Welcome back, {user?.username || 'Admin'}!
        </h1>
        <p className="text-gray-600">
          Manage your website content from the dashboard below.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <action.icon className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.label}
                </h3>
              </div>
              <p className="text-sm text-gray-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Backend API</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Database</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Your Role</span>
              <span className="capitalize font-medium text-gray-900">{user?.role || 'Unknown'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Links</h2>
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <ExternalIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">View Website</span>
            </Link>
            <Link href="/events" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <CalendarIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Events Page</span>
            </Link>
            <Link href="/equipments" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <EquipmentIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Equipment Page</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
}

function EquipmentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClientsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
