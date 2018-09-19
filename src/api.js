let host = window.location.host;
/**
 * 上传文件
 */
export const upload = 'http://192.168.0.252:8081/auth/file/upload'


/**
 * oss后端签名接口
 */
export const ossPolicy = '/api/oss/policy'


/**
 * 登录
 */
export const login = '/auth/login'

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
 * 产品删除
 */
export const delProduct = '/sys/product/delProduct'