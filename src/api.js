let host = window.location.host;
/**
 * 上传文件
 */
export const upload = 'http://192.168.0.252:8081/auth/file/upload'


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