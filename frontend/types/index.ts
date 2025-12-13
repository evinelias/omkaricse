export interface User {
    id: number;
    email: string;
    name: string;
    role: 'SUPER_ADMIN' | 'USER';
    permissions: string[];
    isFrozen: boolean;
    createdAt: string;
}

export interface ActivityLogItem {
    id: number;
    action: string;
    details: string;
    createdAt: string;
    admin: {
        name: string;
        email: string;
    }
}

export interface LeadRemark {
    id: number;
    remark: string;
    adminId: number;
    createdAt: string;
    admin?: { name: string };
}

export interface Lead {
    id: number;
    name: string;
    studentName?: string;
    email: string;
    phone: string;
    source: string;
    inquiryType?: string;
    message: string;
    grade: string;
    city: string;
    status: string;
    createdAt: string;
    lastModifiedBy?: string;
    remarks?: LeadRemark[];
    _count?: {
        remarks: number;
    }
}

export interface EmailSettings {
    receiverEmails: string[];
    isEnabled: boolean;
}

export interface EmailStats {
    total: number;
    success: number;
    failed: number;
    successRate: number;
}

export interface EmailLog {
    id: number;
    recipient: string;
    subject: string;
    status: string;
    error?: string;
    sentAt: string;
}
