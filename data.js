// بيانات نظام إدارة التذاكر - ستكون فارغة ويتم إضافتها من قبل المستخدم

// مصفوفة التذاكر
const ticketsData = [];

// مصفوفة الفرق
const teamsData = [];

// مصفوفة المستخدمين
const usersData = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'المدير',
    role: 'admin',
    email: 'admin@company.com',
    team: ''
  },
  {
    id: 2,
    username: 'teamlead',
    password: 'team123',
    name: 'قائد الفريق',
    role: 'teamlead',
    email: 'teamlead@company.com',
    team: ''
  },
  {
    id: 3,
    username: 'employee',
    password: 'emp123',
    name: 'موظف',
    role: 'employee',
    email: 'employee@company.com',
    team: ''
  }
];

// الإحصائيات
const statsData = {
  totalTickets: 0,
  openTickets: 0,
  inProgressTickets: 0,
  closedTickets: 0,
  totalTeams: 0,
  totalUsers: 3,
  highPriorityTickets: 0,
  mediumPriorityTickets: 0,
  lowPriorityTickets: 0
};

// حفظ البيانات في localStorage
if (typeof localStorage !== 'undefined') {
  // تحقق إذا كانت البيانات موجودة مسبقاً، إذا لم تكن موجودة، احفظ البيانات الفارغة
  if (!localStorage.getItem('tickets')) {
    localStorage.setItem('tickets', JSON.stringify(ticketsData));
  }
  if (!localStorage.getItem('teams')) {
    localStorage.setItem('teams', JSON.stringify(teamsData));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(usersData));
  }
  if (!localStorage.getItem('stats')) {
    localStorage.setItem('stats', JSON.stringify(statsData));
  }
}

// تصدير البيانات
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ticketsData, teamsData, usersData, statsData };
}
