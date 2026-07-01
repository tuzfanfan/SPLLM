/* ============================================================
   store —— 状态管理
============================================================ */

export const store = {
  editor: null,        // Drawflow 实例
  selectedId: null,    // 当前选中节点 id（字符串）
  selectedIds: [],     // 多选节点 id 列表
  data: { nodes:{}, edges:{} },  // 自有数据镜像
  pendingNodes: [],    // 创建中待绑定数据的节点队列
  dirty: false,
  // 撤销/重做
  history: [],         // 历史栈：[{nodes, edges}]
  histIdx: -1,         // 当前索引
  histMax: 50,         // 最大深度
  // 框选
  boxSelect: { active:false, startX:0, startY:0, curX:0, curY:0 },
  // 网格/吸附
  gridSize: 22,
  showGrid: true,
  snapToGrid: false,
  snapToNode: false,
  snapToPort: true,     // 连线吸附到最近节点端口
  connSnapTarget: null, // 当前吸附的端口元素
  connSnapDist: 60,     // 吸附距离阈值（像素）
  nodeSpheres: {},      // 节点3D球体实例：{ nodeId: Sphere3D }
  altPressed: false,    // Alt 键是否按下
  // 主题
  theme: 'dark',        // 'dark' | 'light'
  mutingDirty: false,
  liveDragNodeId: null,
  _shiftDown: false,
};
