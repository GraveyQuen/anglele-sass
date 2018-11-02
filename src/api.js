let host = window.location.host;
/**
 * 上传文件
 */
let uploadHost = '';
if (process.env.NODE_ENV == 'development') {
    uploadHost = 'http://192.168.0.252:8082'
} else {
  uploadHost = ''
}
// export const ws = 'wss://192.168.0.252:8000/ws'
export const ws = 'wss://saas.anglele.com:8000/ws'

export const upload =  uploadHost + '/api/file/upload'


/**
 * oss后端签名接口
 */
export const ossPolicy = '/api/oss/policy'

/**
 * 服务器时间
 */
export const serverTime = '/api/time'


/**
 * 登录
 */
export const login = '/api/login'

/**
 * 修改密码
 */
export const changePass = '/api/changePass'


/**
 * 获取验证码
 */
export const captcha = '/auth/captcha'

/**
 * 获取验证码
 */
export const authSettings = '/auth/settings'

/**
 * 获取用户信息
 */
export const findCurrentUser = '/auth/baseuser/findCurrentUser'

/**
 * 查询省信息
 */
export const findAllArea = '/api/common/findAllArea'

/**
 * 查询省信息
 */
export const findProvince = '/api/common/findProvince'

/**
 * 查询市信息
 */
export const findCity = '/api/common/findCity'

/**
 * 查询区信息
 */
export const findDistrict = '/api/common/findDistrict'

/**
 * 查询计量单位列表
 */
export const findUnitList = '/sys/unit/findUnitList'


/**
 * 保存计量单位信息
 */
export const saveUnit = '/sys/unit/saveUnit'

/**
 * 更新计量单位信息
 */
export const updateUnit = '/sys/unit/updateUnit'

/**
 * 更新计量单位信息
 */
export const delUnit = '/sys/unit/delUnit'


/**
 * 查询所有启用的计量单位
 */
export const findUnit = '/sys/unit/findUnit'



/**
 * 费用分页
 */
export const findFeeList = '/sys/fee/findFeeList'


/**
 * 费用分页
 */
export const updateFee = '/sys/fee/updateFee'


/**
 * 费用分页
 */
export const saveFee = '/sys/fee/saveFee'

/**
 * 费用删除
 */
export const delFee = '/sys/fee/delFee'


/**
 * 所有费用
 */
export const findAllFee = '/sys/fee/findAllFee'



/**
 * 包含物料费的订单列表
 */
export const orderFeePage = '/sys/orderFee/page'


/**
 * 更新订单费用
 */
export const orderFeeChange = '/sys/orderFee/change'


/**
 * 订单费用历史
 */
export const orderFeeHistory = '/sys/orderFee/history'


/**
 * 仓库分页查询
 */
export const findWareHouseList = '/sys/warehouse/findWareHouseList'


/**
 * 保存仓库信息
 */
export const saveWareHouse = '/sys/warehouse/saveWareHouse'


/**
 * 保存仓库信息
 */
export const updateWareHouse = '/sys/warehouse/updateWareHouse'

/**
 * 保存仓库信息
 */
export const modifyWareHouse = '/sys/warehouse/modifyWareHouse'


/**
 * 启用仓库查询
 */
export const findWareHouse = '/sys/warehouse/findWareHouse'

/**
 * 仓库删除
 */
export const deleteWareHouse = '/sys/warehouse/deleteWareHouse'

/**
 *查询商户下所有账号列表
 */
export const findEmployeeList = '/sys/business/findEmployeeList'

/**
 *  配送人列表
 */
export const findDeliveryManList = '/sys/deliveryMan/findDeliveryManList'

/**
 * 所有配送人
 */
export const findAllDeliveryMan = '/sys/deliveryMan/findAllDeliveryMan'

/**
 * 保存配送人
 */
export const saveDeliveryMan = '/sys/deliveryMan/saveDeliveryMan'

/**
 * 更新配送人
 */
export const updateDeliveryMan = '/sys/deliveryMan/updateDeliveryMan'

/**
 * 删除配送人
 */
export const delDeliveryMan = '/sys/deliveryMan/delDeliveryMan'


/**
 * 客户列表
 */
export const findCustomerList = '/sys/customer/findCustomerList'


/**
 * 客户列表
 */
export const saveCustomer = '/sys/customer/saveCustomer'


/**
 * 客户列表
 */
export const updateCustomer = '/sys/customer/updateCustomer'

/**
 * 修改客户状态
 */
export const modifyCustomer = '/sys/customer/modifyCustomer'

/**
 * 重置密码
 */
export const defaultPassword = '/sys/customer/defaultPassword'

/**
 * 查询商户列表
 */
export const findBusinessList = '/sys/business/findBusinessList'

/**
 * 添加商户信息
 */
export const saveBusiness = '/sys/business/saveBusiness'

/**
 * 更新商户信息
 */
export const updateBusiness = '/sys/business/updateBusiness'


/**
 * 禁用商户
 */
export const delBusiness = '/sys/business/delBusiness'


/**
 * 查询商户绑定账号
 */
export const findBusinessUser = '/sys/business/findBusinessUser'


/**
 * 商户添加用户
 */
export const businessAddUser = '/sys/business/addUser'

/**
 * 商户删除用户
 */
export const businessDeleteUser = '/sys/business/deleteUser'

/**
 * 分类列表
 */
export const findCategoryList = '/sys/category/findCategoryList'

/**
 * 保存分类
 */
export const saveCategory = '/sys/category/saveCategory'

/**
 * 更新分类
 */
export const updateCategory = '/sys/category/updateCategory'


/**
 * 查询所有有效的分类
 */
export const findAllCategory = '/sys/category/findAllCategory'



/**
 * 删除分类
 */
export const delCategory = '/sys/category/delCategory'


/**
 * 新增产品
 */
export const saveProduct = '/sys/product/saveProduct'



/**
 * 编辑产品
 */
export const updateProduct = '/sys/product/updateProduct'


/**
 * 查询产品列表
 */
export const findProductList = '/sys/product/findProductList'


/**
 * 查询预警产品列表
 */
export const findWarnProductList = '/sys/product/findWarnProductList'


/**
 * 产品删除
 */
export const delProduct = '/sys/product/delProduct'


/**
 * 商品入库新增
 */
export const wareHouseIn = '/sys/wareHouseIn/in'

/**
 * 商品入库新增
 */
export const wareHouseupdateIn = '/sys/wareHouseIn/updateIn'


/**
 * 入库列表
 */
export const wareHouseInPage = '/sys/wareHouseIn/page'

/**
 * 供应商待客开单
 */
export const businessSaveOrder = '/sys/order/businessSaveOrder'

/**
 * 删除入库单
 */
export const wareHouseInDelete = '/sys/wareHouseIn/delete'

/**
 * 取消入库单
 */
export const wareHouseInCancel = '/sys/wareHouseIn/cancel'

/**
 * 入库单详情
 */
export const wareHouseInDetail = '/sys/wareHouseIn/detail'

/**
 * 损耗单列表
 */
export const findWastageList = '/sys/wastage/findWastageList'


/**
 * 损耗单查询
 */
export const findWastage = '/sys/wastage/findWastage'


/**
 * 生成损耗单
 */
export const saveWastage = '/sys/wastage/saveWastage'



/**
 * 损耗单取消
 */
export const cancelWastage = '/sys/wastage/cancelWastage'


/**
 * 删除损耗单
 */
export const delWastage = '/sys/wastage/delWastage'


/**
 * 编辑损耗单
 */
export const updateWastage = '/sys/wastage/updateWastage'



/**
 * 订单分页
 */
export const orderPage = '/sys/order/page'


/**
 * 订单取消
 */
export const orderCancel = '/sys/order/cancel'

/**
 * 单个订单
 */
export const findOneOrder = '/sys/order/findOneOrder'

/**
 * 订单确认
 */
export const wareHouseOrderOut = '/sys/wareHouseOut/out'


/**
 * 订单确认
 */
export const wareHouseOrderPage = '/sys/wareHouseOut/page'



/**
 * 出库单详情
 */
export const wareHouseOutDetail = '/sys/wareHouseOut/detail'


/**
 * 出库确认
 */
export const wareHouseOutconfirmOut = '/sys/wareHouseOut/confirmOut'

/**
 * 货品出库
 */
export const wareHouseOutproductOut = '/sys/wareHouseOut/productOut'

/**
 * 完成出库单
 */
export const wareHouseOutfinishOut = '/sys/wareHouseOut/finishOut'


/**
 * 打印出库单
 */
export const wareHouseOutPrint = '/sys/wareHouseOut/print'
/**
 * 结算列表
 */
export const settlementPage = '/sys/settlement/page'


/**
 * 结算
 */
export const toSettle = '/sys/settlement/toSettle'

/**
 * 取消结算
 */
export const settleCancel = '/sys/settlement/cancel'

/**
 * 完成结算
 */
export const settleFinish = '/sys/settlement/finish'

/**
 * 打印结算单
 */
export const settlementPrint = '/sys/settlement/print'
/**
 * 修改结算单编号
 */
export const changeSettlementId = '/sys/settlement/changeSettlementId'


// 数据统计

export const summaryStatistics = '/sys/dataStatistics/summaryStatistics'


// 客户销售分布

export const producrSummaryPieCustomer = '/sys/dataStatistics/producrSummaryPieCustomer'

// 分类销售分布

export const producrSummaryPieCategory = '/sys/dataStatistics/producrSummaryPieCategory'


// 产品销售汇总

export const productSummary = '/sys/dataStatistics/productSummary'


// 货品库存管理
export const productWareHouse = '/sys/dataStatistics/productWareHouse'


// 货品出入库分析
export const pruductInOut = '/sys/dataStatistics/pruductInOut'


// 热门销售统计
export const hotSaleSummary = '/sys/dataStatistics/hotSaleSummary'


// 热门销售统计详情
export const hotSaleSummaryInfo = '/sys/dataStatistics/hotSaleSummaryInfo'


// 今日订单汇总
export const todayOrderSummary = '/sys/dataStatistics/todayOrderSummary'



// 今日最新预警
export const todayProductWarn = '/sys/dataStatistics/productWarn'



// 最新消息
export const newMessage = '/sys/dataStatistics/newMessage'


// 今日销售分布
export const todayCustomerPie = '/sys/dataStatistics/todayCustomerPie'


// 今日客户下单分布
export const todayCategoryPie = '/sys/dataStatistics/todayCategoryPie'

// 销售利润报表
export const orderProfit = '/sys/dataStatistics/orderProfit'



// 查询店铺开闭时间

export const findShopTime = '/sys/shopTime/findShopTime'

// 修改店铺的开闭时间

export const modifyShopTime = '/sys/shopTime/modifyShopTime'


// 采购单列表
export const findPurchaseOrderList = '/sys/purchaseOrder/findPurchaseOrderList'


// 采购单删除
export const delPurchaseOrder = '/sys/purchaseOrder/delPurchaseOrder'

// 采购订单管理分页
export const pageForPurchase = '/sys/order/pageForPurchase'

// 采购单生成
export const addPurchaseOrder = '/sys/purchaseOrder/addPurchaseOrder'

// 采购单修改
export const updatePurchaseOrder = '/sys/purchaseOrder/updatePurchaseOrder'


// 采购单详情
export const findPurchaseOrder = '/sys/purchaseOrder/findPurchaseOrder'


// 采购单打印
export const printPurchaseOrder = '/sys/purchaseOrder/printPurchaseOrder'



// 产品试用申请
export const applySaas = '/api/productApply/apply'



// 申请列表
export const productApplyPage = '/sys/productApply/page'


// 完成联系
export const productApplyFinish = '/sys/productApply/finish'


// 退货单列表
export const findOrderRefundList = '/sys/refundOrder/findOrderRefundList'

// 退货单单个查询
export const findOneRefund = '/sys/refundOrder/findOneRefund'

// 订单退货
export const orderRefund = '/sys/refundOrder/orderRefund'



// 取消订单退货
export const cancelRefund = '/sys/refundOrder/cancelRefund'



