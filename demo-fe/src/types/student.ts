//分页
export interface PageResult<T>{
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
}

// ==================== 学生模块类型 ====================

/** 学生实体（对应后端 Student.java + BaseEntity） */
export interface Student {
    id: number;
    studentNo: string;    // 学号
    name: string;         // 姓名
    gender: number;       // 性别：1-男 2-女
    idCard: string;       // 身份证号
    phone: string;        // 手机号
    email: string;        // 邮箱
    classId: number;      // 班级ID
    bedId: number | null; // 床位ID（未分配时为null）
    userId: number | null;// 关联用户ID
    createTime: string;   // 创建时间
    updateTime: string;   // 更新时间
  }
  
  /** 学生查询参数（对应后端 StudentQueryDTO） */
  export interface StudentQuery {
    studentNo?: string;   // 学号（模糊查询）
    name?: string;        // 姓名（模糊查询）
    gender?: number;      // 性别
    classId?: number;     // 班级ID
    current?: number;     // 页码，默认1
    size?: number;        // 每页条数，默认10
  }
  
  /** 新增/修改学生参数（对应后端 StudentSaveDTO） */
  export interface StudentSave {
    id?: number;          // 修改时必传，新增时不传
    studentNo: string;    // 学号（必填）
    name: string;         // 姓名（必填）
    gender: number;       // 性别（必填）
    idCard?: string;      // 身份证号
    phone?: string;       // 手机号
    email?: string;       // 邮箱
    classId: number;      // 班级ID（必填）
  }
  
  /** 分配床位参数（对应后端 AssignBedDTO） */
  export interface AssignBed {
    studentId: number;    // 学生ID（必填）
    targetBedId: number;  // 目标床位ID（必填）
  }
  
  /** 分配床位返回结果（对应后端 AssignBedResultVO） */
  export interface AssignBedResult {
    studentId: number;
    oldBedId: number | null;  // 调换时的旧床位ID
    newBedId: number;
    operation: 'assign' | 'swap'; // assign-首次分配 swap-调换
  }