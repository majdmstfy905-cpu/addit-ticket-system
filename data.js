// بيانات تجريبية لنظام إدارة التذاكر
const ticketsData = [
  {
    id: 1,
    title: 'مشكلة في تسجيل الدخول',
    description: 'المستخدم لا يستطيع تسجيل الدخول إلى النظام',
    status: 'open',
    priority: 'high',
    category: 'تقني',
    assignedTo: 'أحمد محمد',
    createdBy: 'سارة علي',
    createdAt: '2025-11-10',
    updatedAt: '2025-11-12'
  },
  {
    id: 2,
    title: 'طلب صيانة للطابعة',
    description: 'الطابعة في المكتب الرئيسي لا تعمل',
    status: 'in-progress',
    priority: 'medium',
    category: 'صيانة',
    assignedTo: 'خالد حسن',
    createdBy: 'محمد عمر',
    createdAt: '2025-11-11',
    updatedAt: '2025-11-12'
  },
  {
    id: 3,
    title: 'تحديث البرنامج المحاسبي',
    description: 'نحتاج تحديث النظام المحاسبي للإصدار الجديد',
    status: 'open',
    priority: 'low',
    category: 'تطوير',
    assignedTo: 'فاطمة يوسف',
    createdBy: 'عمر سالم',
    createdAt: '2025-11-09',
    updatedAt: '2025-11-11'
  },
  {
    id: 4,
    title: 'خطأ في التقرير الشهري',
    description: 'التقرير الشهري يظهر بيانات غير صحيحة',
    status: 'closed',
    priority: 'high',
    category: 'تقني',
    assignedTo: 'أحمد محمد',
    createdBy: 'ليلى أحمد',
    createdAt: '2025-11-05',
    updatedAt: '2025-11-08'
  },
  {
    id: 5,
    title: 'إضافة مستخدم جديد',
    description: 'إضافة حساب للموظف الجديد في القسم المالي',
    status: 'in-progress',
    priority: 'medium',
    category: 'إداري',
    assignedTo: 'خالد حسن',
    createdBy: 'نورا حسين',
    createdAt: '2025-11-12',
    updatedAt: '2025-11-12'
  },
  {
    id: 6,
    title: 'مشكلة في الشبكة',
    description: 'انقطاع متكرر للإنترنت في الطابق الثاني',
    status: 'open',
    priority: 'high',
    category: 'تقني',
    assignedTo: 'أحمد محمد',
    createdBy: 'حسن علي',
    createdAt: '2025-11-12',
    updatedAt: '2025-11-12'
  },
  {
    id: 7,
    title: 'طلب تدريب على النظام الجديد',
    description: 'الفريق يحتاج تدريب على ميزات النظام الجديد',
    status: 'open',
    priority: 'low',
    category: 'تدريب',
    assignedTo: 'فاطمة يوسف',
    createdBy: 'رامي صالح',
    createdAt: '2025-11-10',
    updatedAt: '2025-11-11'
  },
  {
    id: 8,
    title: 'استبدال جهاز كمبيوتر',
    description: 'جهاز الكمبيوتر قديم ويحتاج للاستبدال',
    status: 'closed',
    priority: 'medium',
    category: 'صيانة',
    assignedTo: 'خالد حسن',
    createdBy: 'مها عبدالله',
    createdAt: '2025-11-01',
    updatedAt: '2025-11-07'
  }
];

const teamsData = [
  {
    id: 1,
    name: 'فريق الدعم التقني',
    members: ['أحمد محمد', 'سارة علي', 'محمد عمر'],
    lead: 'أحمد محمد',
    department: 'تقنية المعلومات'
  },
  {
    id: 2,
    name: 'فريق الصيانة',
    members: ['خالد حسن', 'عمر سالم', 'حسن علي'],
    lead: 'خالد حسن',
    department: 'الصيانة'
  },
  {
    id: 3,
    name: 'فريق التطوير',
    members: ['فاطمة يوسف', 'رامي صالح', 'ليلى أحمد'],
    lead: 'فاطمة يوسف',
    department: 'تطوير البرمجيات'
  },
  {
    id: 4,
    name: 'فريق الموارد البشرية',
    members: ['نورا حسين', 'مها عبدالله'],
    lead: 'نورا حسين',
    department: 'الموارد البشرية'
  }
];

const usersData = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'أحمد محمد',
    role: 'admin',
    email: 'ahmed@company.com',
    team: 'فريق الدعم التقني'
  },
  {
    id: 2,
    username: 'teamlead',
    password: 'team123',
    name: 'خالد حسن',
    role: 'teamlead',
    email: 'khaled@company.com',
    team: 'فريق الصيانة'
  },
  {
    id: 3,
    username: 'employee',
    password: 'emp123',
    name: 'فاطمة يوسف',
    role: 'employee',
    email: 'fatima@company.com',
    team: 'فريق التطوير'
  }
];

const statsData = {
  totalTickets: 8,
  openTickets: 3,
  inProgressTickets: 2,
  closedTickets: 3,
  totalTeams: 4,
  totalUsers: 3,
  highPriorityTickets: 3,
  mediumPriorityTickets: 3,
  lowPriorityTickets: 2
};

// حفظ البيانات في localStorage
if (typeof localStorage !== 'undefined') {
  localStorage.setItem('tickets', JSON.stringify(ticketsData));
  localStorage.setItem('teams', JSON.stringify(teamsData));
  localStorage.setItem('users', JSON.stringify(usersData));
  localStorage.setItem('stats', JSON.stringify(statsData));
}

// تصدير البيانات
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ticketsData, teamsData, usersData, statsData };
}
