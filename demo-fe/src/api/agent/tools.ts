const BACKEND = "http://localhost:8080";

interface ToolDef{
    schema: object;
    handler: (args: Record<string,unknown>) => Promise<unknown>;
}

const tools: Record<string,ToolDef> = {};

//楼宇
tools["listBuildings"] = {
    schema:{
        type: "function",
        function: {
            name: "listBuildings",
            description: "获取所有宿舍楼的列表",
            parameters: { type:"object", properties: {}, required: []},
        },
    },
    handler: async () => {
        const res = await fetch(`${BACKEND}/building/list`);
        const json = await res.json();
        return json.data;
    },
};

// -------------------- 房间相关 --------------------

  tools["getFreeBeds"] = {
      schema: {
          type: "function",
          function: {
              name: "getFreeBeds",
              description: "查询某个房间的空闲床位，返回空闲床位列表",
              parameters: {
                  type: "object",
                  properties: {
                      roomId: { type: "string", description: "房间ID" },
                  },
                  required: ["roomId"],
              },
          },
      },
      handler: async (args) => {
          const res = await fetch(`${BACKEND}/room/${args.roomId}/beds`);
          const json = await res.json();
          return json.data.filter((b: { status: number }) => b.status === 0);
      },
  };

  tools["listRooms"] = {
      schema: {
          type: "function",
          function: {
              name: "listRooms",
              description: "分页查询房间列表，可按楼宇ID、楼层筛选",
              parameters: {
                  type: "object",
                  properties: {
                      buildingId: { type: "string", description: "楼宇ID，可选" },
                      floor: { type: "number", description: "楼层，可选" },
                      current: { type: "number", description: "页码，默认1" },
                      size: { type: "number", description: "每页条数，默认10" },
                  },
                  required: [],
              },
          },
      },
      handler: async (args) => {
          const params = new URLSearchParams();
          if (args.buildingId) params.set("buildingId", String(args.buildingId));
          if (args.floor) params.set("floor", String(args.floor));
          params.set("current", String(args.current || 1));
          params.set("size", String(args.size || 10));
          const res = await fetch(`${BACKEND}/room/page?${params}`);
          const json = await res.json();
          return json.data;
      },
  };

  // -------------------- 班级相关 --------------------

  tools["listClasses"] = {
      schema: {
          type: "function",
          function: {
              name: "listClasses",
              description: "获取所有班级列表",
              parameters: { type: "object", properties: {}, required: [] },
          },
      },
      handler: async () => {
          const res = await fetch(`${BACKEND}/class/list`);
          const json = await res.json();
          return json.data;
      },
  };

  // -------------------- 学生相关 --------------------

  tools["searchStudents"] = {
      schema: {
          type: "function",
          function: {
              name: "searchStudents",
              description: "按条件查询学生列表，可按姓名、学号、性别、班级ID筛选",
              parameters: {
                  type: "object",
                  properties: {
                      name: { type: "string", description: "姓名，模糊查询" },
                      studentNo: { type: "string", description: "学号，模糊查询" },
                      gender: { type: "number", description: "性别，1-男 2-女" },
                      classId: { type: "string", description: "班级ID" },
                      current: { type: "number", description: "页码，默认1" },
                      size: { type: "number", description: "每页条数，默认10" },
                  },
                  required: [],
              },
          },
      },
      handler: async (args) => {
          const params = new URLSearchParams();
          if (args.name) params.set("name", String(args.name));
          if (args.studentNo) params.set("studentNo", String(args.studentNo));
          if (args.gender) params.set("gender", String(args.gender));
          if (args.classId) params.set("classId", String(args.classId));
          params.set("current", String(args.current || 1));
          params.set("size", String(args.size || 20));
          const res = await fetch(`${BACKEND}/student/page?${params}`);
          const json = await res.json();
          return json.data;
      },
  };


/* 获取所有的工具Schema列表*/
export function getToolSchemas(): object[]{
    return Object.values(tools).map((t) => t.schema);
}


/*根据函数名找到handler并执行 */
export async function executeTool(
    name:string,
    args: Record<string,unknown>,
):Promise<unknown> {
    const tool = tools[name];
    if (!tool) throw new Error(`未知工具：${name}`);
    return tool.handler(args);
}